//Node.js express
var express = require('express');
// var log = require('log')
var fs = require('fs');

// cookies see https://github.com/expressjs/cookie-parser
var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');

var util = require('util');
var mime = require('mime');

var path = require("path");
var temp_dir = path.join(process.cwd(), 'temp/');
var uploads_dir = path.join(process.cwd(), 'uploads/');

if (!fs.existsSync(temp_dir)) {
    fs.mkdirSync(temp_dir);
}

if (!fs.existsSync(uploads_dir)) {
    fs.mkdirSync(uploads_dir);
}

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var Twitter = require('twitter');


//local modules (JS files)
// var utils = require('./utils');
var Emoji = require('./lib/emoji.js');
var SentimentAnalysis = require('./lib/sentiment-analysis.js');
var EntityAnalysis = require('./lib/entity-analysis.js');
var Translate = require('./lib/translate.js');
var NXAPIPacks = require('./lib/api-connector/api-connector.js');

createEJSTemplateDataDictionary = function (req, res) {
  return { session: req.session, activeRoute: req.activeRoute };
}


//storage
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);



var app = express();

app.set('port', (process.env.PORT || 5000));

var cookiesSecretKey = (process.env.COOKIES_SECRET_KEY || 'cookiesSecret');

app.use(cookieParser(cookiesSecretKey));

//for now use cookie session (in-memory)
app.use(session({  secret: cookiesSecretKey }));

//
// app.use(session({
//     store: new RedisStore(options),
//     secret: 'secret data'
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//add current route to the request so templates can extract it
app.use(function(req, res, next) {
    req.activeRoute = req.path.split('/')[1] // [0] will be empty since routes start with '/'
    next();
});

//add a check for signed in cookies to all routes
app.use(function (req, res, next) {

//don't do this check for the login page, login processing, or the about page
//(about page has two versions, one signed in, one signed out)
  if (req.originalUrl != "/login"
          && req.originalUrl != "/loginCheck"
          && req.originalUrl != "/about") {
    var signedIn = req.cookies.a16zAIKey;

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


var gcloud_pid = process.env.GOOGLE_CLOUD_PID;
var privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY;
var clientEmail = process.env.GOOGLE_CLOUD_EMAIL;


var config = {
  projectId: gcloud_pid,
  credentials : {
      client_email : clientEmail,
      private_key : privateKey
    }
};

var gcloud = require('google-cloud')(config);

var vision = gcloud.vision();

//docs route catch-all
app.get('/docs/*', function(req, res) {
  var docPath = __dirname + '/views'+'/pages'+req.path+".ejs";
  var canProceed = false;
  try {
    var file = fs.statSync(docPath);
    canProceed = file.isFile();
  } catch (error) {

    }

    if (!canProceed) {
      console.log("Requested docs path "+docPath+ " not found.");
      res.redirect('/404');
      return;

    }

  res.render('pages'+req.path, createEJSTemplateDataDictionary(req, res));

});

app.get('/about', function(req, res) {
  res.render('pages/about', createEJSTemplateDataDictionary(req, res));
});

app.get('/login', function(req, res) {
  res.render('pages/login', createEJSTemplateDataDictionary(req, res));
});

app.get('/logout', function (req, res) {
  res.cookie("a16zAIKey",'');
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
    res.cookie("a16zAIKey",'ok');
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


function base64Image(src) {
  var data = fs.readFileSync(src).toString('base64');
  return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

function base64ImageFromBinaryBuffer(name, src) {
  var data = src.toString('base64');
  return util.format('data:%s;base64,%s', name, data);
}


app.get('/test/image/simple', function (req, res) {
  // Choose what the Vision API should detect
 // Choices are: faces, landmarks, labels, logos, properties, safeSearch, texts
 var types = ['labels', 'landmarks', 'logos', 'properties', 'safeSearch', 'text', 'faces'];
  var filePath = './test-data/images/test-image-2.jpg';
  var base64ImageData =  base64Image(filePath);
// vision.detect(filePath, types, function(err, detections, apiResponse) {

 // Send the image to the Cloud Vision API
 vision.detect(base64ImageData, types, function(err, detections, apiResponse) {
   var renderText = "";
   if (err) {
     console.log("Image processing error."+err);
     renderText += "<h1>Cloud Vision Error</h1>";
     renderText += err;
     var dataDict =  createEJSTemplateDataDictionary(req, res);
     dataDict.errorText = renderText;
     dataDict.results = "";
     dataDict.imgData = "";
     res.render('pages/image-test', dataDict);
   }
   else {

     console.log("Image processing ok.");
     var dataDict =  createEJSTemplateDataDictionary(req, res);
     dataDict.results = detections;
     dataDict.imgData = base64ImageData;

     res.render('pages/image-test', dataDict);
   }
 });
});
app.get('/test/image/upload', upload.single('photo'), function (req, res) {
  var dataDict =  createEJSTemplateDataDictionary(req, res);
  var renderText = "";
  renderText += "<h1>Cloud Vision Start</h1>";
dataDict.errorText = renderText;
  dataDict.results = "";
  dataDict.imgData = "";

  res.render('pages/image-upload', dataDict);
});

app.post('/process/image/upload', upload.single('photo'), function (req, res) {
  // Choose what the Vision API should detect
 // Choices are: faces, landmarks, labels, logos, properties, safeSearch, texts
 var types = ['labels', 'landmarks', 'logos', 'properties', 'safeSearch', 'text', 'faces'];
 var optionsDict = new Object();
 optionsDict.types = types;
 optionsDict.verbose = true;
  var filePath = './test-data/images/test-image-2.jpg';
  var uploadedFile =  req.file;//base64Image(filePath);
  console.log("converting...");

  var base64ImageData = base64ImageFromBinaryBuffer(uploadedFile.originalname, uploadedFile.buffer);
/*
{ fieldname: 'photo',
11:15:57 AM web.1 |    originalname: 'crazy-signs-notice.jpg',
11:15:57 AM web.1 |    encoding: '7bit',
11:15:57 AM web.1 |    mimetype: 'image/jpeg',
11:15:57 AM web.1 |    buffer: <Buffer ff d8 ff e0... >,
11:15:57 AM web.1 |    size: 44346 }

*/


// vision.detect(filePath, types, function(err, detections, apiResponse) {
console.log("analyzing...");
 // Send the image to the Cloud Vision API
 vision.detect(uploadedFile.buffer, optionsDict, function(err, detections, apiResponse) {
   var renderText = "";
   console.log("received google Api response...");
   if (err) {
     console.log("Image processing error."+err);
     renderText += "<h1>Cloud Vision Error</h1>";
     renderText += err;
     var dataDict =  createEJSTemplateDataDictionary(req, res);
     dataDict.errorText = renderText;
     dataDict.results = "";
     dataDict.imgData = "";
     res.render('pages/image-test', dataDict);
   }
   else {

     console.log("Image processing ok, filename="+uploadedFile.originalname);
     var dataDict =  createEJSTemplateDataDictionary(req, res);
     dataDict.results = detections;
     dataDict.imgData = base64ImageData;
    //  console.log(detections);

     res.render('pages/image-test', dataDict);
   }
 });
});



app.get('/', function(req, res) {
  res.render('pages/index', createEJSTemplateDataDictionary(req, res));
});

app.get('/test/twitter/sentiment', function (req, res) {

     var client = new Twitter({
     consumer_key: process.env.TWITTER_CONSUMER_KEY,
     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
     access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
   });


  var screenName = 'withfries2'; //default
  var screenNameParam = req.query.screenName;
  if (screenNameParam != undefined && screenNameParam.trim().length > 0) {
    screenName = screenNameParam.trim();
  }
  var defaultResultsCount = 25;

    var apiRoute = 'statuses/user_timeline';
    var params = {screen_name: screenName, count: defaultResultsCount};

  var checkMentions = false;

  if (req.query.checkMentions == "true") {
    // https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=2
    checkMentions = true;
    apiRoute = 'search/tweets';
    params = { q: ("@"+screenName), count: defaultResultsCount};
  }

  /*
  search results also include
  search_metadata:     { completed_in: 0.042,  max_id: 769203907067277300,
  max_id_str: '769203907067277312',
  next_results: '?max_id=769158202504118271&q=%40withfries2&include_entities=1',
  query: '%40withfries2',
  refresh_url: '?since_id=769203907067277312&q=%40withfries2&include_entities=1',
  count: 15,
  since_id: 0,
  since_id_str: '0' } }
  */

  client.get(apiRoute, params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);

      var dataDict =  createEJSTemplateDataDictionary(req, res);

      //when doing a search the result is in the statuses entry of the response object
      var tweetsToCheck = checkMentions ? tweets.statuses : tweets;

      var analyzedTweets = [];
      for (num in tweetsToCheck) {
        var tweet = tweetsToCheck[num];
        var text = tweet.text;
        var postedBy = tweet.user;
        if (text != undefined && text.length > 0) {
          var tweetText = tweet.text;
          var sentimental = SentimentAnalysis.sentimentalAnalyze(tweetText);
          sentimental.emoji = Emoji.mapNumberToEmoji(sentimental.score);
          var sentiment = SentimentAnalysis.sentimentJS(tweetText);
          sentiment.emoji = Emoji.mapNumberToEmoji(sentiment.score);

          var average = Object();
          average.score = (sentimental.score + sentiment.score) / 2;
          average.emoji = Emoji.mapNumberToEmoji(average.score);

          var aTweet = { text: tweetText, 'average' : average, 'sentimental': sentimental, 'sentimentJS': sentiment, user: postedBy};
          analyzedTweets.push(aTweet);
        }
        else {
          console.log("text length 0 or nil");
        }

      }
      dataDict.tweets = analyzedTweets;
      dataDict.screenName = screenName;
      dataDict.checkMentions = checkMentions;
      res.render('pages/tweet-sentiment', dataDict);


    }
  });
});


var apiAddCompletion = function(apiPack, success, message) {
    console.log((success?"OK: ":"ERROR: ")+message);
}

NXAPIPacks.connector.setAPIRoot('/api');
NXAPIPacks.connector.setApp(app);

var sentimentAnalysisExamples = [
  "The weather today is really nice.",
  "The Matrix was a fantastic movie.",
  "A ten pound laptop is not a good travel companion."
];

var entityAnalysisExamples = [
  "George lives in New York City and his car is a Jaguar XL. George also owns a copy of the Guernica by Picasso. He likes Halloween.",
  "IBM and Google are companies.",
  "It is better to commute to San Francisco using BART."
];


var languageAnalysisExamples = [
  "Hello world!",
  "Hola mundo!",
  "Bonjour le monde!",
  "你好，世界!",
  "則可能是兩種類型的中國文本的區別開來", //chinese traditional (same sentence "it is possible to distinguish between the two types of chinese text.")
  "则可能是两种类型的中国文本的区别开来"   //chinese simplified
];

var entityAnalysisCommonServiceInfo = {
  id: "entity-analysis",
  name : "Phrase Entity Analysis",
  description : "Extract entities from sentences or paragraphs.",
  testSamples: entityAnalysisExamples
}

var sentimentAnalysisCommonServiceInfo = {
  id: "sentiment-analysis",
  name : "Phrase Sentiment Analysis",
  description : "Infer sentiment behind sentences or paragraphs.",
  testSamples: sentimentAnalysisExamples
}


var languageAnalysisCommonServiceInfo = {
  id: "translate",
  name : "Language detection",
  description : "Language detection.",
  testSamples: languageAnalysisExamples
}

var sentimentJSAPI = NXAPIPacks.connector.addAPI({
    id: "js-sentimentjs",
    provider: "Andrew Sliwinski",
    name: "Sentiment.JS (node.js library)",
    providerUrl: "https://github.com/thisandagain/sentiment",
    consoleUrl: "",
    officialGithubURL: "https://github.com/thisandagain/sentiment",
    unofficialGithubURL: "",
    description: "AFINN-based sentiment analysis for Node.js."
});

sentimentJSAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.sentimentJSAPIPack, apiAddCompletion);

var sentimentalJSAPI = NXAPIPacks.connector.addAPI({
    id: "js-sentimental",
    provider: "Kevin M Roth",
    name: "Sentimental (node.js library)",
    providerUrl: "https://github.com/thinkroth/Sentimental",
    consoleUrl: "",
    officialGithubURL: "https://github.com/thinkroth/Sentimental",
    unofficialGithubURL: "",
    description: "Sentiment analysis tool for node.js based on the AFINN-111 wordlist."
});


sentimentalJSAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.sentimentalJSAPIPack, apiAddCompletion);

var ibmAPI = NXAPIPacks.connector.addAPI({
    id: "ibm-alchemy",
    provider: "IBM",
    name: "IBM Alchemy Language API",
    providerUrl: "http://www.ibm.com/watson/developercloud/alchemy-language.html",
    consoleUrl: "https://console.ng.bluemix.net",
    officialGithubURL: "https://github.com/watson-developer-cloud/alchemylanguage-nodejs",
    unofficialGithubURL: "",
    description: "IBM's AlchemyLanguage API offers text analysis through natural language processing. The AlchemyLanguage APIs can analyze text and help you to understand its sentiment, keywords, entities, high-level concepts and more."
});


ibmAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.alchemyEntityAPIPack, apiAddCompletion);
ibmAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.alchemySentimentAPIPack, apiAddCompletion);


var ibmWatsonAPI = NXAPIPacks.connector.addAPI({
    id: "ibm-watson",
    provider: "IBM",
    name: "IBM Watson Developer Cloud",
    providerUrl: "http://www.ibm.com/watson/developercloud/",
    consoleUrl: "https://console.ng.bluemix.net",
    officialGithubURL: "https://github.com/watson-developer-cloud/",
    unofficialGithubURL: "",
    description: "Enable cognitive computing features in your app using IBM Watson's Language, Vision, Speech and Data APIs."
});

ibmWatsonAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.ibmToneAnalysisAPIPack, apiAddCompletion);


var googleAPI = NXAPIPacks.connector.addAPI({
    id: "google-cloud",
    provider: "Google",
    name: "Google Cloud APIs",
    providerUrl: "https://cloud.google.com",
    consoleUrl: "https://console.cloud.google.com/",
    officialGithubURL: "https://github.com/GoogleCloudPlatform/google-cloud-node",
    unofficialGithubURL: "",
    description: "Cloud Machine Learning API (https://cloud.google.com/natural-language/docs/)."
});

googleAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.googleEntityAnalysisAPIPack, apiAddCompletion);
googleAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.googleSentimentAnalysisAPIPack, apiAddCompletion);
googleAPI.addService(languageAnalysisCommonServiceInfo, Translate.googleTranslateAPIPack, apiAddCompletion);


var msAzureAPI = NXAPIPacks.connector.addAPI({
    id: "ms-azure",
    provider: "Microsoft",
    name: "Microsoft Azure Cognitive Services",
    providerUrl: "https://azure.microsoft.com/en-us/services/cognitive-services/",
    consoleUrl: "https://portal.azure.com/",
    officialGithubURL: "",
    unofficialGithubURL: "https://github.com/joshbalfour/node-cognitive-services",
    description: "Allow your apps to process natural language, evaluate sentiment and topics, and learn how to recognize what users want.."
});
msAzureAPI.addService(sentimentAnalysisCommonServiceInfo, SentimentAnalysis.msAzureSentimentAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(entityAnalysisCommonServiceInfo, EntityAnalysis.msAzureEntityAnalysisAPIPack, apiAddCompletion);
msAzureAPI.addService(languageAnalysisCommonServiceInfo, Translate.msAzureTranslateAPIPack, apiAddCompletion);

// console.log("Entity Analysis APIs = "+JSON.stringify(NXAPIPacks.connector.getApisForServiceType("entity-analysis")));
// console.log("Sentiment Analysis APIs = "+JSON.stringify(NXAPIPacks.connector.getApisForServiceType("sentiment-analysis")));


app.get('/test/phrase/sentiment',
    function (req, res) {
      var dataDict =  createEJSTemplateDataDictionary(req, res);

      dataDict.apiServiceInfo = {id: "no_id", name: "No info", description: "no description.", testSamples: []};
      // dataDict.apis = JSON.stringify();
      var apis = NXAPIPacks.connector.getApisForServiceType("sentiment-analysis");

      dataDict.apiEndpoints = [];
      if (apis.length > 0) {
        //get sample text from the first element
        dataDict.apiServiceInfo = apis[0].serviceInfo;

        for (i in apis) {
          var api = apis[i];
          var clientPack = api.createClientPack();

          dataDict.apiEndpoints.push(clientPack);
          // console.log("api = "+JSON.stringify(clientPack.getEndpointURL()));

        }
      }

      res.render('pages/phrase-analysis', dataDict);

    });


    app.get('/test/phrase/translate',
        function (req, res) {
          var dataDict =  createEJSTemplateDataDictionary(req, res);

          dataDict.apiServiceInfo = {id: "no_id", name: "No info", description: "no description.", testSamples: []};
          // dataDict.apis = JSON.stringify();
          var apis = NXAPIPacks.connector.getApisForServiceType("translate");

          dataDict.apiEndpoints = [];
          if (apis.length > 0) {
            //get sample text from the first element
            dataDict.apiServiceInfo = apis[0].serviceInfo;

            for (i in apis) {
              var api = apis[i];
              var clientPack = api.createClientPack();

              dataDict.apiEndpoints.push(clientPack);
              // console.log("api = "+JSON.stringify(clientPack.getEndpointURL()));

            }
          }

          res.render('pages/phrase-analysis', dataDict);

        });


    app.get('/test/phrase/entities',
        function (req, res) {
          var dataDict =  createEJSTemplateDataDictionary(req, res);

          dataDict.apiServiceInfo = {id: "no_id", name: "No info", description: "no description.", testSamples: []};
          // dataDict.apis = JSON.stringify();
          var apis = NXAPIPacks.connector.getApisForServiceType("entity-analysis");

          dataDict.apiEndpoints = [];
          if (apis.length > 0) {
            //get sample text from the first element
            dataDict.apiServiceInfo = apis[0].serviceInfo;

            for (i in apis) {
              var api = apis[i];
              var clientPack = api.createClientPack();

              dataDict.apiEndpoints.push(clientPack);
              // console.log("api = "+JSON.stringify(clientPack.getEndpointURL()));

            }
          }

          res.render('pages/phrase-analysis', dataDict);

        });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.render('pages/error', createEJSTemplateDataDictionary(req, res));
});
