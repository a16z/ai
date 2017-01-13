
var express = require('express');

var fs = require('fs');

// cookies see https://github.com/expressjs/cookie-parser
var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var util = require('util');
var mime = require('mime');
var compression = require('compression');
var compressible = require('compressible');
var cache = require('apicache').middleware;

var path = require("path");
var temp_dir = path.join(process.cwd(), 'temp/');
var uploads_dir = path.join(process.cwd(), 'uploads/');
// require('ssl-root-cas').inject().addFile('./server.crt');

if (!fs.existsSync(temp_dir)) {
    fs.mkdirSync(temp_dir);
}

if (!fs.existsSync(uploads_dir)) {
    fs.mkdirSync(uploads_dir);
}

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//local modules (JS files)
// var utils = require('./utils');

var SentimentAnalysis = require('./lib/sentiment-analysis.js');
var EntityAnalysis = require('./lib/entity-analysis.js');
var LanguageAnalysis = require('./lib/language-analysis.js');
var ImageAnalysis = require('./lib/image-analysis.js');
var NXAPIPacks = require('./lib/api-connector/api-connector.js');

createEJSTemplateDataDictionary = function (req, res) {
  return { session: req.session, activeRoute: req.activeRoute, recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY };
}


//storage
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);

var app = express();
// var privateKey  = fs.readFileSync('./key.pem', 'utf8');
// var certificate = fs.readFileSync('./server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

app.set('port', (process.env.PORT || 5000));

var cookiesSecretKey = (process.env.COOKIES_SECRET_KEY || 'cookiesSecret');

app.use(cookieParser(cookiesSecretKey));

//for now use cookie session (in-memory)
app.use(session({  secret: cookiesSecretKey }));

//
// app.use(session({
//     store: new RedisStore(options),
//     secret: 'secretdata'
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(compression());

//add current route to the request so templates can extract it
app.use(function(req, res, next) {
    req.activeRoute = req.path.split('/')[1] // [0] will be empty since routes start with '/'
    next();
});

app.use(function (req, res, next) {

//don't do this check for the login page, login processing, or the about page
//(about page has two versions, one signed in, one signed out)
  if (req.originalUrl != "/login"
          && req.originalUrl != "/loginCheck"
          && req.originalUrl != "/about") {
    var signedIn = req.cookies.aiKeyCheck;

    if (signedIn !== "ok") {
      // console.log('not signed in');
      req.session.signedIn = undefined
        res.redirect("/login");
        return;
    }
    else {
      req.session.signedIn = "yes"
    }
  }

  next();

});



var markdownCache = Object.create(null);
var SectionPageProcessor = require('./lib/section-page-processor.js');

//docs route - use markdown files as content source for pages
app.get('/docs/*', function(req, res) {

    var dataDict = createEJSTemplateDataDictionary(req, res);

    SectionPageProcessor.processMarkdownPage(dataDict, req, res, markdownCache);

});

app.get('/contact', function(req, res) {
  res.render('pages/contact', createEJSTemplateDataDictionary(req, res));
});

app.get('/login', function(req, res) {
  res.render('pages/login', createEJSTemplateDataDictionary(req, res));
});

app.get('/logout', function (req, res) {
  res.cookie("aiKeyCheck",'');
  req.session.signedIn = undefined
  req.session.loginError = undefined
  res.redirect("/");
});

app.post('/loginCheck', function (req, res) {
  // console.log("phrase = "+req.body.secretKey);
  var secretKey = req.body.secretKey;
  var redirectPath = "/";
  if (secretKey == process.env.A16Z_AI_SECRET_KEY) {
    //set the cookie, redirect to /
    res.cookie("aiKeyCheck",'ok');
  }
  else {
    //redirect to / with an error
    redirectPath = "/login";
    if (secretKey.length > 0) {
      req.session.loginError = "Invalid Key"
    }
  }

  res.redirect(redirectPath);
});



app.get('/', function(req, res) {
  res.render('pages/index', createEJSTemplateDataDictionary(req, res));
});



var apiAddCompletion = function(apiPack, success, message) {
    console.log((success?"OK: ":"ERROR: ")+message);
}

NXAPIPacks.connector.setAPIRoot('/api');
NXAPIPacks.connector.setApp(app);

//on examples, if displayText is not included the value will be used
/*
var entityAnalysisExamples = [
  { "value": "George lives in New York City and his car is a Jaguar XL. George also owns a copy of the Guernica by Picasso. He likes Halloween."},
  { "value": "IBM and Google are companies."},
  { "value": "It is better to commute to San Francisco using BART."}
];
var entityAnalysisServiceInfo
{
  id: "entity-analysis",
  name : "Phrase Entity Analysis",
  description : "Extract entities from sentences or paragraphs.",
  testSamples: entityAnalysisExamples
}
*/


function loadServiceInfo(parameters) {
  var serviceId = parameters.serviceId;
  var loadSamples = parameters.loadSamples;

  var infoPath = path.join(process.cwd(), parameters.topLevelFolder, serviceId, serviceId+"_info.json");
  var info = require(infoPath);
  if ((info != undefined) && loadSamples) {
    var samplesPath = path.join(process.cwd(), parameters.topLevelFolder,  serviceId, serviceId+"_samples.json");
    var samples = require(samplesPath);

    if (samples != undefined) {
      info.testSamples = samples;
    }
  }

  return info;
}

function loadApi(pathToAPIJSONFile) {
  console.log("Loading api info from "+pathToAPIJSONFile);
  var apiInfo = require(pathToAPIJSONFile);
  if (apiInfo != undefined) {
    NXAPIPacks.connector.addAPI(apiInfo);
  }
  else {
    console.log("Error loading API info from "+pathToAPIJSONFile);
  }
}

function loadAllAPIs(rootPath) {
  var folderPath = path.join(process.cwd(), rootPath);

  var files = fs.readdirSync(folderPath);
  files.forEach(file => {
    // console.log(file);

    var filePath = path.join(folderPath, file);
    loadApi(filePath);
  });

}

loadAllAPIs('public/data/services/apis');

var languageAnalysisCommonServiceInfo = loadServiceInfo({serviceId: 'language-analysis', topLevelFolder: 'public/data/services', loadSamples: true});

var entityAnalysisCommonServiceInfo = loadServiceInfo({serviceId: 'entity-analysis', topLevelFolder: 'public/data/services', loadSamples: true});

var sentimentAnalysisCommonServiceInfo = loadServiceInfo({serviceId: 'sentiment-analysis', topLevelFolder: 'public/data/services', loadSamples: true});

var imageAnalysisCommonServiceInfo = loadServiceInfo({serviceId: 'image-analysis', topLevelFolder: 'public/data/services', loadSamples: true});

NXAPIPacks.connector
    .apiForId("js-sentimentjs")
        .addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.sentimentJSAPIPack, apiAddCompletion);

NXAPIPacks.connector
    .apiForId("js-sentimental")
        .addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.sentimentalJSAPIPack, apiAddCompletion);

var ibmAPI = NXAPIPacks.connector.apiForId("ibm-alchemy");

ibmAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.alchemyEntityAPIPack, apiAddCompletion);
ibmAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.alchemySentimentAPIPack, apiAddCompletion);
ibmAPI.addService(languageAnalysisCommonServiceInfo, LanguageAnalysis.alchemyLangAnalysisAPIPack, apiAddCompletion);

var ibmWatsonAPI = NXAPIPacks.connector.apiForId("ibm-watson");

ibmWatsonAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.ibmToneAnalysisAPIPack, apiAddCompletion);

var googleAPI = NXAPIPacks.connector.apiForId("google-cloud");

googleAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.googleEntityAnalysisAPIPack, apiAddCompletion);
googleAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.googleSentimentAnalysisAPIPack, apiAddCompletion);
googleAPI.addService(languageAnalysisCommonServiceInfo, LanguageAnalysis.googleLangAnalysisAPIPack, apiAddCompletion);

googleAPI.addService(imageAnalysisCommonServiceInfo, ImageAnalysis.googleImageAnalysisAPIPack, apiAddCompletion);


var msAzureAPI = NXAPIPacks.connector.apiForId("ms-azure");

msAzureAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.msAzureSentimentAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.msAzureEntityAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(languageAnalysisCommonServiceInfo, LanguageAnalysis.msAzureLangAnalysisAPIPack, apiAddCompletion);

var recastAIAPI = NXAPIPacks.connector.apiForId("recast-ai");
recastAIAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.recastaiEntityAPIPack, apiAddCompletion);

var apiAIAPI = NXAPIPacks.connector.apiForId("api-ai");
apiAIAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.apiaiEntityAPIPack, apiAddCompletion);

var image2json = require('./lib/nx/image2json.js');

function registerGet(expressApp, urlPath, serviceId, resultPagePath) {
  //path would end up being something like '/test/phrase/sentiment-analysis',
  const requestPath = path.join(urlPath, serviceId);
  //something like 'pages/data-analysis' to be used in the render() call
  const resultPath = resultPagePath;
  const sid = serviceId;
  const currentApp = expressApp;

//eg  app.get('/test/phrase/sentiment-analysis',
  currentApp.get(requestPath,
      function (req, res) {
        var dataDict =  createEJSTemplateDataDictionary(req, res);

        dataDict.apiServiceInfo = {id: "no_id", name: "No info", description: "no description.", contentType: "none", testSamples: []};
        // dataDict.apis = JSON.stringify();
        var apis = NXAPIPacks.connector.getApisForServiceType(sid); //eg sid = 'sentiment-analysis'

        dataDict.apiEndpoints = [];
        if (apis.length > 0) {
          //get sample text from the first element
          dataDict.apiServiceInfo = apis[0].serviceInfo;
          dataDict.apiContentType = dataDict.apiServiceInfo.contentType;
          if (dataDict.apiServiceInfo.contentType == 'image') {
              dataDict.apiServiceInfo.sampleImages = [];
              for (i in dataDict.apiServiceInfo.testSamples) {
                var imgPath = path.join(process.cwd(), dataDict.apiServiceInfo.testSamples[i].value);
                var jsonInfo = image2json.NXImage.jsonImageFromFile(imgPath);
                dataDict.apiServiceInfo.sampleImages.push(jsonInfo);
              }
          }


          for (i in apis) {
            var api = apis[i];
            var clientPack = api.createClientPack();

            dataDict.apiEndpoints.push(clientPack);
          }
        }

        res.render(resultPath, dataDict);

      });
};

registerGet(app, "/test/phrase", "sentiment-analysis", "pages/data-analysis");
registerGet(app, "/test/phrase", "entity-analysis", "pages/data-analysis");
registerGet(app, "/test/phrase", "language-analysis", "pages/data-analysis");
registerGet(app, "/test/image", "image-analysis", "pages/data-analysis");

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.render('pages/error', createEJSTemplateDataDictionary(req, res));
});
