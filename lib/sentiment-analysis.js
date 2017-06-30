var NXAPIPacks = require('./api-connector/api-connector.js');

//not used at the moment (unofficial library)
// const cognitiveServices = require('cognitive-services');

//used for MS APIs
const najax = require('najax');

const EmojiFunctions = require('./emoji.js');

// IBM/Watson/Alchemy
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');


// #sentiment.js see https://github.com/thisandagain/sentiment
var sentimentJS = require('sentiment');

//see https://github.com/thinkroth/Sentimental
var sentimentalAnalyze = require('Sentimental').analyze,
    sentimentalPositivity = require('Sentimental').positivity,
    sentimentalNegativity = require('Sentimental').negativity;

//simply return "positive", neutral, or negative for simplicity
//receive a score of -100 to 100
var normalizeSentimentScore = function(score) {
  var roundedScore = Math.round(score);
  var text = "unk";
  if (score < -75) {
    text = "very negative";
  }
  else if (score < -10) {
    text = "negative";
  }
  else if (score >= -10 && score <= 10) {
    text = "neutral";
  }
  else if (score < 75) {
    text = "positive";
  }
  else {
    text = "very positive";
  }

  return text + " ("+roundedScore+")";
}

var sentimentJSAPIPack = function (apiInfo, packType) {

  var apiPack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  apiPack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";

      serverPack.params = {
        text: phrase
      };


      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  apiPack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {

    var analysisResult = sentimentJS(serverPack.params.text);
    apiResponse.serverResponse = analysisResult;
    analysisResult.scoreRange = "returns values between -10 and 10";
    apiResponse.result.score = normalizeSentimentScore(analysisResult.score * 10);
    completion(apiResponse);

  });

  return apiPack;
};

exports.sentimentJSAPIPack = sentimentJSAPIPack;


var sentimentalJSAPIPack = function (apiInfo, packType) {

  var apiPack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  apiPack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";

      serverPack.params = {
        text: phrase
      };


      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  apiPack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {


    var analysisResult = sentimentalAnalyze(serverPack.params.text);
    apiResponse.serverResponse = analysisResult;
    analysisResult.scoreRange = "returns values between -10 and 10";
    apiResponse.result.score = normalizeSentimentScore(analysisResult.score * 10);
    completion(apiResponse);

  });

  return apiPack;
};

exports.sentimentalJSAPIPack = sentimentalJSAPIPack;




//////////////////

var alchemySentimentAPIPack = function (apiInfo, packType) {
  // var alchemy_language;
  // var alchemy_params;

  var apiPack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  apiPack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      serverPack.alchemy_language = new AlchemyLanguageV1({
         "url": "https://gateway-a.watsonplatform.net/calls",
        api_key: process.env.IBM_ALCHEMY_API_KEY
      });

      serverPack.alchemy_params = {
        text: phrase
      };


      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  apiPack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {

    serverPack.alchemy_language.sentiment(serverPack.alchemy_params, function (err, response) {
      var resultObject;
      if (err) {
        // console.log('alchemy_api error:', err);
        apiResponse.result.score = -1;
        apiResponse.error = "Error received on API call.";
        resultObject = err;
      }
      else {
        // console.log(' alchemy_api: ok');
        response.docSentiment.scoreRange = "returns values between -1 and 1";
        apiResponse.result.score = normalizeSentimentScore(response.docSentiment.score * 100);
        resultObject = response;
      }
      apiResponse.serverResponse = resultObject;

      completion(apiResponse);
    });
  });

  return apiPack;
};

exports.alchemySentimentAPIPack = alchemySentimentAPIPack;
////



var ibmToneAnalysisAPIPack = function (apiInfo, packType) {

  var apiPack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  apiPack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";

      serverPack.tone_analyzer = new ToneAnalyzerV3({
        username: process.env.IBM_WATSON_TONE_USERNAME,
        password: process.env.IBM_WATSON_TONE_PASSWORD,
        version_date: '2016-05-19'
      });

      serverPack.params = {
        text: phrase
      };


      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  apiPack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {


    serverPack.tone_analyzer.tone(serverPack.params,
      function(err, tone) {

        var resultObject;

        if (err) {
          console.log('error:', err);
          apiResponse.result.score = -1;
          resultObject = err;
        }
        else {
          // console.log(JSON.stringify(tone, null, 2));
          /*
          */
          var tones = tone.document_tone.tone_categories[0].tones;
          var score = 0;
          var anger = 0, disgust = 0, fear = 0, joy = 0, sadness = 0;
          var toneScoresById = Object.create(null);// joy, anger, disgust, sadness, fear
          //need to transform the array we get into dictionary
          for (cat in tones) {
            var tonecat = tones[cat];
            toneScoresById[tonecat.tone_id] = tonecat.score;
          }
          score = (toneScoresById['joy']-toneScoresById['anger']) * 100;
          tone.document_tone.scoreRange = "tone_categories contains multiple values between 0 and 1";
          apiResponse.result.score = normalizeSentimentScore(score);
        }

        resultObject = tone;


        apiResponse.serverResponse = resultObject;
        completion(apiResponse);

      }
    );



  });

  return apiPack;
};
exports.ibmToneAnalysisAPIPack = ibmToneAnalysisAPIPack;


//Google

var googleSentimentAnalysisAPIPack = function (apiInfo, packType) {

  var apiPack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  apiPack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      baseAPIResponse.phrase = phrase;

      var gcloud_pid = process.env.GCLOUD_PROJECT;
      var privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n');
      var clientEmail = process.env.GOOGLE_CLOUD_EMAIL;

      serverPack.gcloudConfig = {
        projectId: gcloud_pid,
        credentials : {

            "private_key": privateKey,
            "client_email" : clientEmail,
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

  apiPack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
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
          sentiment.scoreRange = "returns values between -1 and 1";
          apiResponse.result.score = normalizeSentimentScore(sentiment.score * 100); //normalizeSentimentScore(sentiment.magnitude * multiplier);
          resultObject = sentiment;
        }

        apiResponse.serverResponse = resultObject;


        completion(apiResponse);
    });
  });

  return apiPack;
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
        var score = response.documents[0].score;
        response.documents[0].scoreRange = "returns values between 0 and 1";
        //returns values between 0 and 1
        score = ((score * 2) - 1) * 100;
        apiResponse.result.score = normalizeSentimentScore(score);
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
