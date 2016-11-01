var NXAPIPacks = require('./api-connector/api-connector.js');

//not used at the moment (unofficial library)
// const cognitiveServices = require('cognitive-services');

//used for MS APIs
const najax = require('najax');


// #sentiment.js see https://github.com/thisandagain/sentiment
var sentimentJS = require('sentiment');
exports.sentimentJS = sentimentJS;

//see https://github.com/thinkroth/Sentimental
var sentimentalAnalyze = require('Sentimental').analyze,
    sentimentalPositivity = require('Sentimental').positivity,
    sentimentalNegativity = require('Sentimental').negativity;

  exports.sentimentalAnalyze = sentimentalAnalyze;
  exports.sentimentalPositivity = sentimentalPositivity;
  exports.sentimentalNegativity = sentimentalNegativity;

var sentimentJSEndpoint =
    function (req, res) {

      var phrase = req.body.phrase;

      var responseData = Object();
      responseData.processed = "true";
      responseData.phrase = phrase;
      responseData.result = Object();
      responseData.inputDataPresent = "true";
      console.log('phrase:', phrase);

      var sendDate = (new Date()).getTime();

      if (phrase != undefined && phrase.length > 0) {
        responseData.inputDataPresent = "true";
        var analysisResult = sentimentJS(phrase);
        responseData.serverResponse = analysisResult;
        responseData.result.score = analysisResult.score;
      }
      else {
        responseData.inputDataPresent = "false";
      }

      var receiveDate = (new Date()).getTime();

      var responseTimeMs = receiveDate - sendDate;
      responseData.apiTime = responseTimeMs;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(responseData));
    };

exports.sentimentJSEndpoint = sentimentJSEndpoint;


var sentimentalJSEndpoint = function (req, res) {

          var phrase = req.body.phrase;

          var responseData = Object();
          responseData.processed = "true";
          responseData.phrase = phrase;
          responseData.result = Object();
          responseData.inputDataPresent = "true";
          console.log('phrase:', phrase);

          var sendDate = (new Date()).getTime();

          if (phrase != undefined && phrase.length > 0) {
            responseData.inputDataPresent = "true";
            var analysisResult = sentimentalAnalyze(phrase);
            responseData.serverResponse = analysisResult;
            responseData.result.score = analysisResult.score;
            // console.log('x:', JSON.stringify(analysisResult));
          }
          else {
            responseData.inputDataPresent = "false";
          }

          var receiveDate = (new Date()).getTime();

          var responseTimeMs = receiveDate - sendDate;
          responseData.apiTime = responseTimeMs;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(responseData));
        };
exports.sentimentalJSEndpoint = sentimentalJSEndpoint;

// IBM/Watson/Alchemy
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

exports.ToneAnalyzerV3 = ToneAnalyzerV3;

var ibmWatsonToneSentiment = function(textToAnalyze) {
    var tone_analyzer = new ToneAnalyzerV3({
      username: process.env.IBM_WATSON_TONE_USERNAME,
      password: process.env.IBM_WATSON_TONE_PASSWORD,
      "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
      version_date: '2016-05-19'
    });

    tone_analyzer.tone({ text: textToAnalyze },
      function(err, tone) {
        if (err)
          console.log(err);
        else
          console.log(JSON.stringify(tone, null, 2));
    });
}
exports.ibmWatsonToneSentiment = ibmWatsonToneSentiment;

var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var ibmAlchemySentiment = function(textToAnalyze) {

}

exports.ibmAlchemySentiment = ibmAlchemySentiment;

var analyzeSentiment = function(phrase) {
  var result = Object();
  result.processed = "true";
  result.phrase = phrase;
  result.results = [];

  if (phrase != undefined && phrase.length > 0) {
      var sentimentJSResult = sentimentJS(phrase);
      sentimentJSResult.apiName = "sentimentJS";
      result.results.push(sentimentJSResult);

      var sentimentalResult = sentimentalAnalyze(phrase);
      sentimentalResult.apiName = "sentimental";
      result.results.push(sentimentalResult);

      console.log("calling alchemy");
      ibmAlchemySentiment(phrase);
      console.log("end alchemy");
      console.log("calling tone");
      ibmWatsonToneSentiment(phrase);
      console.log("end tone");

      var averageResult = Object();
      var sum = 0;
      for (i in result.results) {
        var r = result.results[i];
        sum += r.score;
      }

      averageResult.score = (sum/result.results.length);
      averageResult.apiName = "Average";
      result.results.push(averageResult);

  }

};

exports.analyzeSentiment = analyzeSentiment;


var alchemySentimentEndpoint = function (req, res) {

  var phrase = req.body.phrase;

  var responseData = Object();
  responseData.processed = "true";
  responseData.phrase = phrase;
  responseData.result = {score: 0.2};
  var sendDate = (new Date()).getTime();

  if (phrase != undefined && phrase.length > 0) {
    responseData.inputDataPresent = "true";
    var alchemy_language = new AlchemyLanguageV1({
       "url": "https://gateway-a.watsonplatform.net/calls",
      api_key: process.env.IBM_ALCHEMY_API_KEY
    });

    var params = {
      text: phrase
    };

    alchemy_language.sentiment(params, function (err, response) {
      var receiveDate = (new Date()).getTime();
      var responseTimeMs = receiveDate - sendDate;
      responseData.apiTime = responseTimeMs;
      responseData.result = Object();

      if (err) {
        console.log('error:', err);
        responseData.result.score = -1;

      }
      else {
        var multiplier = response.docSentiment.type == "positive" ? 1 : -1;
        responseData.result.score = (response.docSentiment.score * 10) * multiplier;
        // console.log(JSON.stringify(response, null, 2));
      }

      responseData.serverResponse = response;


      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(responseData));
    });

  }
  else {

    var receiveDate = (new Date()).getTime();
    var responseTimeMs = receiveDate - sendDate;
    responseData.apiTime = responseTimeMs;
    result.inputDataPresent = "false";
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(responseData));
  }
};

exports.alchemySentimentEndpoint = alchemySentimentEndpoint;

var ibmToneAnalysisEndpoint =  function (req, res) {

      var phrase = req.body.phrase;

      var responseData = Object();
      responseData.processed = "true";
      responseData.phrase = phrase;
      responseData.result = {score: 0.3};
      responseData.inputDataPresent = "true";

      var sendDate = (new Date()).getTime();

      if (phrase != undefined && phrase.length > 0) {
        responseData.inputDataPresent = "true";

        var tone_analyzer = new ToneAnalyzerV3({
          username: process.env.IBM_WATSON_TONE_USERNAME,
          password: process.env.IBM_WATSON_TONE_PASSWORD,
          version_date: '2016-05-19'
        });

        tone_analyzer.tone({ text: phrase },
          function(err, tone) {

            var receiveDate = (new Date()).getTime();
            var responseTimeMs = receiveDate - sendDate;
            responseData.apiTime = responseTimeMs;
            responseData.result = Object();
            if (err) {
              // console.log("---ERROR on :"+req);
              // console.log(err);
              // console.log("---ERROR:");
              responseData.result.score = -1;
            }
            else {
              // console.log(JSON.stringify(tone, null, 2));
              /*
              */
              var tones = tone.document_tone.tone_categories[0].tones;
              var score = 0;
              for (cat in tones) {
                var tonecat = tones[cat];
                if (tonecat.tone_id == "Joy") {
                  score = 10 * (tonecat.score);
                }
              }
              responseData.result.score = score;
            }

            responseData.serverResponse = tone;


            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(responseData));

        });
      }
      else {

        var receiveDate = (new Date()).getTime();
        var responseTimeMs = receiveDate - sendDate;
        responseData.apiTime = responseTimeMs;
        result.inputDataPresent = "false";
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
      }
    };

exports.ibmToneAnalysisEndpoint = ibmToneAnalysisEndpoint;


//Google

var googleSentimentAnalysisAPIPack = function (apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      baseAPIResponse.phrase = phrase;

      var gcloud_pid = process.env.GOOGLE_CLOUD_PID;
      var privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY;
      var clientEmail = process.env.GOOGLE_CLOUD_EMAIL;

      serverPack.gcloudConfig = {
        projectId: gcloud_pid,
        credentials : {
            client_email : clientEmail,
            private_key : privateKey
          }
      };
      serverPack.gcloud = require('google-cloud')(serverPack.gcloudConfig);
      var language = serverPack.gcloud.language();
      var doc = language.document({content: phrase, type: "text", language: "en"});
      var config = { verbose: true }; // Get more detailed results

      serverPack.gcloudParameters = {
        language: language,
        doc: doc,
        config: config
      };

      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
    // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document

    var language = serverPack.gcloudParameters.language;
    var doc = serverPack.gcloudParameters.doc;
    var config = serverPack.gcloudParameters.config;


    doc.detectSentiment(config, function (err, sentiment) {

        // console.log("entities = "+JSON.stringify(entities));
        var resultObject;
        if (err) {
          console.log('error:', err);
          apiResponse.result.score = -1;
          resultObject = err;
        }
        else {
          var multiplier = (sentiment.polarity >= 0) ? 1 : -1;
          apiResponse.result.score = sentiment.magnitude * multiplier;
          resultObject = sentiment;
        }

        apiResponse.serverResponse = resultObject;


        completion(apiResponse);
    });
  });

  return entitypack;
};

exports.googleSentimentAnalysisAPIPack = googleSentimentAnalysisAPIPack;


/// Microsoft

var msAzureSentimentAnalysisAPIPack = function (apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      baseAPIResponse.phrase = phrase;

      var azureCognitiveApiKey = process.env.MS_AZURE_COGNITIVE_SERVICES_API_KEY;

      // var textAnalytics = new cognitiveServices.textAnalytics({
      //     API_KEY: azureCognitiveApiKey
      // })
      var docBodyObj = {
        "documents": [{
          "language": "en",
          "id": "1",
          "text": phrase
        }]
      }
      var jsonData = JSON.stringify(docBodyObj);
      var params = {
                  // Request parameters
              };

      serverPack.azureCognitiveApiKey = azureCognitiveApiKey;
      serverPack.azureJSONData = jsonData;
      serverPack.azureParameters = params;

      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
    // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document


    najax({
        url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
        dataType: "json",
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", serverPack.azureCognitiveApiKey);
        },
        type: "POST",
        // Request body
        data: serverPack.azureJSONData,
    })
    .done(function(response) {

      apiResponse.serverResponse = response;

      apiResponse.result.score = -1;
      if (response.documents != undefined && response.documents.length > 0) {
        apiResponse.result.score = response.documents[0].score;
      }
      // var multiplier = (sentiment.polarity >= 0) ? 1 : -1;
      // responseData.result.score = sentiment.magnitude * multiplier;
      // console.log(JSON.stringify(response, null, 2));

      completion(apiResponse);

    })
    .fail(function(err) {

        console.error('MS Azure Sentiment - Encountered error making request:', err);

        apiResponse.result = Object();
        apiResponse.serverResponse = err;

        completion(apiResponse);

    });
  });

  return entitypack;
};

exports.msAzureSentimentAnalysisAPIPack = msAzureSentimentAnalysisAPIPack;
//
//
//   var azureSentimentAnalysisEndpoint =  function (req, res) {
//
//
//     var azureCognitiveApiKey = process.env.MS_AZURE_COGNITIVE_SERVICES_API_KEY;
//
//     // var textAnalytics = new cognitiveServices.textAnalytics({
//     //     API_KEY: azureCognitiveApiKey
//     // })
//
//
//     var phrase = req.body.phrase;
//
//
//
//
//         var responseData = Object();
//         responseData.processed = "true";
//         responseData.phrase = phrase;
//         responseData.result = {score: 0.2};
//         var sendDate = (new Date()).getTime();
//
//         if (phrase != undefined && phrase.length > 0) {
//
//           responseData.inputDataPresent = "true";
//           var docBodyObj = {
//             "documents": [{
//               "language": "en",
//               "id": "1",
//               "text": phrase
//             }]
//           }
//           var jsonData = JSON.stringify(docBodyObj);
//           var params = {
//                       // Request parameters
//                   };
//
//                   najax({
//                       url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
//                       dataType: "json",
//                       beforeSend: function(xhrObj){
//                           // Request headers
//                           xhrObj.setRequestHeader("Content-Type","application/json");
//                           xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", azureCognitiveApiKey);
//                       },
//                       type: "POST",
//                       // Request body
//                       data: jsonData,
//                   })
//                   .done(function(response) {
//                     // console.log('MS Azure Sentiment Got response', response);
//
//                     var receiveDate = (new Date()).getTime();
//                     var responseTimeMs = receiveDate - sendDate;
//                     responseData.apiTime = responseTimeMs;
//                     responseData.result = Object();
//                     responseData.serverResponse = response;
//
//                     responseData.result.score = -1;
//                     if (response.documents != undefined && response.documents.length > 0) {
//                       responseData.result.score = response.documents[0].score;
//                     }
//                     // var multiplier = (sentiment.polarity >= 0) ? 1 : -1;
//                     // responseData.result.score = sentiment.magnitude * multiplier;
//                     // console.log(JSON.stringify(response, null, 2));
//
//
//                     res.setHeader('Content-Type', 'application/json');
//                     res.send(JSON.stringify(responseData));
//                   })
//                   .fail(function(err) {
//
//                       console.error('MS Azure Sentiment - Encountered error making request:', err);
//
//                       var receiveDate = (new Date()).getTime();
//                       var responseTimeMs = receiveDate - sendDate;
//                       responseData.apiTime = responseTimeMs;
//                       responseData.result = Object();
//                       responseData.serverResponse = err;
//
//
//                       res.setHeader('Content-Type', 'application/json');
//                       res.send(JSON.stringify(responseData));
//
//                   });
//
//
//
//         }
//         else {
//
//                   var receiveDate = (new Date()).getTime();
//                   var responseTimeMs = receiveDate - sendDate;
//                   responseData.apiTime = responseTimeMs;
//                   result.inputDataPresent = "false";
//                   res.setHeader('Content-Type', 'application/json');
//                   res.send(JSON.stringify(result));
//         }
//
// };
// exports.azureSentimentAnalysisEndpoint = azureSentimentAnalysisEndpoint;
