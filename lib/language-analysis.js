var NXAPIPacks = require('./api-connector/api-connector.js');

const najax = require('najax');
const iso6391Table = require('./data/iso639-1');

const EmojiFunctions = require('./emoji.js');

var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var alchemyLangAnalysisAPIPack = function(apiInfo, packType) {
  // var alchemy_language;
  // var alchemy_params;

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

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
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {

    serverPack.alchemy_language.language(serverPack.alchemy_params, function(err, response) {
      var resultObject;

      if (err) {
        // console.log('alchemy_api error:', err);
        apiResponse.result.score = -1;
        apiResponse.error = "Error received on API call.";
        resultObject = err;
      } else {
        var isoCode = response['iso-639-1'];
        var lang = iso6391Table[isoCode];
        apiResponse.result.score = (lang == undefined) ? isoCode : lang;

        // console.log(' alchemy_api: ok');
        resultObject = response;
      }
      apiResponse.serverResponse = resultObject;

      completion(apiResponse);
    });
  });

  return entitypack;
};

exports.alchemyLangAnalysisAPIPack = alchemyLangAnalysisAPIPack;

//Google

var googleLangAnalysisAPIPack = function(apiInfo, packType) {

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
        credentials: {
          client_email: clientEmail,
          private_key: privateKey
        }
      };
      serverPack.gcloud = require('google-cloud')(serverPack.gcloudConfig);

      // var translate = require('google-cloud/translate');

      // var translateClient = translate({
      //   key: 'AIzaSyAbKL9Vq_XdXIIVwJDkyMcJmUOxfwQwWrE'
      // });
      var translateClient = serverPack.gcloud.translate({
        key: 'AIzaSyAbKL9Vq_XdXIIVwJDkyMcJmUOxfwQwWrE'
      });
      var config = {
        verbose: true
      }; // Get more detailed results

      serverPack.gcloudParameters = {
        // language: language,
        doc: phrase,
        config: config
      };

      serverPack.translateClient = translateClient;

      serverPack.setReady(true);
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
    // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document

    var language = serverPack.translateClient;
    var doc = serverPack.gcloudParameters.doc;
    var config = serverPack.gcloudParameters.config;


    serverPack.translateClient.detect(doc, function(err, results) {

      // console.log("entities = "+JSON.stringify(entities));
      var resultObject;
      if (err) {
        console.log('error:', err);
        apiResponse.result.score = -1;
        resultObject = err;
      } else {

        // results = {
        //   language: 'en',
        //   confidence: 1,
        //   input: 'Hello'
        // }
        var count = 0;
        var lang = iso6391Table[results.language];
        apiResponse.result.score = (lang == undefined) ? results.language : lang;
        resultObject = results;
      }

      apiResponse.serverResponse = resultObject;


      completion(apiResponse);
    });
  });

  return entitypack;
};

exports.googleLangAnalysisAPIPack = googleLangAnalysisAPIPack;

var msAzureLangAnalysisAPIPack = function(apiInfo, packType) {

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
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
    // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document


    najax({
        url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages",
        dataType: "json",
        beforeSend: function(xhrObj) {
          // Request headers
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", serverPack.azureCognitiveApiKey);
        },
        type: "POST",
        // Request body
        data: serverPack.azureJSONData,
      })
      .done(function(response) {

        apiResponse.serverResponse = response;

        apiResponse.result.score = -1;
        var detectedLanguages = (response.documents != undefined) ? response.documents[0].detectedLanguages : undefined;
        if (detectedLanguages != undefined && detectedLanguages.length > 0) {
          // var score = detectedLanguages[0].score;
          //returns values between 0 and 1
          var res = detectedLanguages[0]['iso6391Name'];

          var lang = iso6391Table[res];
          apiResponse.result.score = (lang == undefined) ? res : lang;


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

exports.msAzureLangAnalysisAPIPack = msAzureLangAnalysisAPIPack;
