var NXAPIPacks = require('./api-connector/api-connector.js');

const najax = require('najax');

const EmojiFunctions = require('./emoji.js');

var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var alchemyEntityAPIPack = function (apiInfo, packType) {
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
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {

    serverPack.alchemy_language.entities(serverPack.alchemy_params, function (err, response) {
      var resultObject;
      if (err) {
        // console.log('alchemy_api error:', err);
        apiResponse.result.score = -1;
        apiResponse.error = "Error received on API call.";
        resultObject = err;
      }
      else {
        // console.log(' alchemy_api: ok');
        apiResponse.result.score = response.entities.length;
        resultObject = response;
      }
      apiResponse.serverResponse = resultObject;

      completion(apiResponse);
    });
  });

  return entitypack;
};

exports.alchemyEntityAPIPack = alchemyEntityAPIPack;

//Google

var googleEntityAnalysisAPIPack = function (apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;
    var recaptchaResponse = req.body.gRecaptchaResponse;
    var remoteIp = req.connection.remoteAddress;


        if (phrase != undefined && phrase.length > 0) {
          baseAPIResponse.inputDataPresent = "true";
          baseAPIResponse.phrase = phrase;

          var gcloud_pid = process.env.GCLOUD_PROJECT;
          var privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n');
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
          var doc = language.document({content: phrase});
          var config = { verbose: true }; // Get more detailed results

          serverPack.gcloudParameters = {
            language: language,
            doc: doc,
            config: config,
            recaptchaResponse: recaptchaResponse,
            remoteIp: remoteIp
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
    var recaptchaResponse = serverPack.gcloudParameters.recaptchaResponse;
    var remoteIp = serverPack.gcloudParameters.remoteIp;

    serverPack.checkRecaptcha(recaptchaResponse, remoteIp, function() {

        if (serverPack.isRecaptchaOk()) {
            doc.detectEntities(config, function (err, entities) {

                // console.log("entities = "+JSON.stringify(entities));
                var resultObject;
                if (err) {
                  console.log('error:', err);
                  apiResponse.result.score = -1;
                  resultObject = err;
                }
                else {
                  var count = 0;
                  var entityTypes = ['people', 'places', 'organizations', 'goods', 'events'];
                  for (t in entityTypes) {
                    var type = entityTypes[t];
                    if (entities[type] != undefined && entities[type].length > 0) {
                      count += entities[type].length
                    }
                  }
                  apiResponse.result.score = count;
                  resultObject = entities;
                }

                apiResponse.serverResponse = resultObject;


                completion(apiResponse);
            });
        }
        else {
            apiResponse.result.score = -1;
            apiResponse.serverResponse = "Captcha error";
            completion(apiResponse);
        }
    });

  });

  return entitypack;
};

exports.googleEntityAnalysisAPIPack = googleEntityAnalysisAPIPack;






/// Microsoft

var msAzureEntityAnalysisAPIPack = function (apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      baseAPIResponse.phrase = phrase;

      var azureCognitiveApiKey = process.env.MS_AZURE_COG_SERVICES_ENTITY_LINKING_API_KEY;

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
      serverPack.document = phrase;
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
        url: "https://api.projectoxford.ai/entitylinking/v1.0/link",
        dataType: "text/plain",
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","text/plain");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", serverPack.azureCognitiveApiKey);
        },
        type: "POST",
        // Request body
        data: serverPack.document,
    })
    .done(function(responseText) {

      var response = JSON.parse(responseText);
      apiResponse.serverResponse = response;

      apiResponse.result.score = -1;
      if (response.entities != undefined && response.entities.length >= 0) {
        response.scoreRange = "returns multiple entity matches";
        apiResponse.result.score = response.entities.length;
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

exports.msAzureEntityAnalysisAPIPack = msAzureEntityAnalysisAPIPack;


//recast ai
var recastai = require('recastai');

var recastaiClient = new recastai.Client(process.env.RECAST_AI_TOKEN, 'en');

var recastaiEntityAPIPack = function (apiInfo, packType) {
  // var alchemy_language;
  // var alchemy_params;

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      serverPack.inputText = phrase

      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {

      recastaiClient.textConverse(serverPack.inputText)
      .then(function(response)  {
      apiResponse.result.score = response.entities.length;
      resultObject = response;
      apiResponse.serverResponse = resultObject;
      completion(apiResponse);

  }).catch(function(err)  {
      apiResponse.result.score = -1;
      apiResponse.error = "Error received on API call.";
      resultObject = err;
      apiResponse.serverResponse = resultObject;

      completion(apiResponse);
  })

  });

  return entitypack;
};

exports.recastaiEntityAPIPack = recastaiEntityAPIPack;



//api.ai
var apiai = require('apiai');

var apiaiClient = apiai(process.env.API_AI_TOKEN);

var apiaiEntityAPIPack = function (apiInfo, packType) {
  // var alchemy_language;
  // var alchemy_params;

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      serverPack.inputText = phrase

      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {


      var uniqueSessionId = "SESSION-"+Math.random() ; //unique session id to identify user

      var request = apiaiClient.textRequest(serverPack.inputText, {sessionId: uniqueSessionId});


            request.on('response', function(response) {
                apiResponse.result.score = 0;//response.entities.length;
                resultObject = response;
                apiResponse.serverResponse = resultObject;
                completion(apiResponse);
            });

            request.on('error', function(err) {
                apiResponse.result.score = -1;
                apiResponse.error = "Error received on API call.";
                resultObject = err;
                apiResponse.serverResponse = resultObject;

                completion(apiResponse);
            });

            request.end();



  });

  return entitypack;
};

exports.apiaiEntityAPIPack = apiaiEntityAPIPack;
