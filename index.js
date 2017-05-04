require('dotenv').config();
var express = require('express');

var fs = require('fs');
var slugify = require('slugify');
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

var API_OFF = false;

// This should remain disabled for most people, this is enabled for our production environment
var rateLimitingEnabled = process.env.RATE_LIMITING_ENABLED || false;

var RateLimit, ExpressMiddleware, redis, rateLimiter, options, limitMiddleware;

if (rateLimitingEnabled) {
   RateLimit = require('ratelimit.js').RateLimit;
   ExpressMiddleware = require('ratelimit.js').ExpressMiddleware;
   redis = require('redis');

   rateLimiter = new RateLimit(redis.createClient(process.env.REDIS_URL), [{interval: parseInt(process.env.RATE_LIMITING_INTERVAL), limit: parseInt(process.env.RATE_LIMITING_REQUESTS)}]);

   options = {
    ignoreRedisErrors: true // defaults to false
  };
  limitMiddleware = new ExpressMiddleware(rateLimiter, options);
}

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
  // Set a body class hook to append to <body>
  var localBodyClass = '';
  if(req.originalUrl === '/') {
    localBodyClass = 'home';
  } else {
    localBodyClass = slugify(req.originalUrl.replace(/\//g, ' '));
  }
  return { session: req.session, activeRoute: req.activeRoute, recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY, bodyClass: localBodyClass };
};

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

app.use(bodyParser.urlencoded({ limit:'2mb', extended: true })); // for parsing

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
  if (req.originalUrl.substring(0,4) === '/api' && API_OFF) {
    return {success: false};
  }

  next();
});

if (limitMiddleware) {
  app.use('/api', limitMiddleware.middleware(function(req, res, next) {
    res.status(429).json({message: 'rate limit exceeded'});
  }));
}

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

var languageTranslationCommonServiceInfo = loadServiceInfo({serviceId: 'language-translation', topLevelFolder: 'public/data/services', loadSamples: true});

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

googleAPI.addService(languageTranslationCommonServiceInfo, LanguageAnalysis.googleLangTranslationAPIPack, apiAddCompletion);

var amazonAPI = NXAPIPacks.connector.apiForId("amazon-ai");
amazonAPI.addService(imageAnalysisCommonServiceInfo, ImageAnalysis.amazonImageAnalysisAPIPack, apiAddCompletion);

var clarifaiAPI = NXAPIPacks.connector.apiForId("clarifai");
clarifaiAPI.addService(imageAnalysisCommonServiceInfo, ImageAnalysis.clarifaiImageAnalysisAPIPack, apiAddCompletion);

var msAzureAPI = NXAPIPacks.connector.apiForId("ms-azure");
msAzureAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.msAzureSentimentAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.msAzureEntityAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(languageAnalysisCommonServiceInfo, LanguageAnalysis.msAzureLangAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(imageAnalysisCommonServiceInfo, ImageAnalysis.msAzureImageAnalysisAPIPack, apiAddCompletion);

var baiduAPI = NXAPIPacks.connector.apiForId("baidu");
baiduAPI.addService(languageTranslationCommonServiceInfo, LanguageAnalysis.baiduLangTranslationAPIPack, apiAddCompletion);

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

        dataDict.apiServiceInfo = {id: "no_id", name: "No info", description: "no description.", contentType: "none", xtra: {"type":"none"}, testSamples: []};
        // dataDict.apis = JSON.stringify();
        var apis = NXAPIPacks.connector.getApisForServiceType(sid); //eg sid = 'sentiment-analysis'

        dataDict.apiEndpoints = [];
        if (apis.length > 0) {
          //get sample text from the first element
          dataDict.apiServiceInfo = apis[0].serviceInfo;
          dataDict.apiContentType = dataDict.apiServiceInfo.contentType;
          dataDict.xtra = dataDict.apiServiceInfo.xtra;
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
registerGet(app, "/test/phrase", "language-translation", "pages/data-analysis");

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.render('pages/error', createEJSTemplateDataDictionary(req, res));
});
