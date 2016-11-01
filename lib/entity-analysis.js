var NXAPIPacks = require('./api-connector/api-connector.js');

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
      var doc = language.document({content: phrase});
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
  });

  return entitypack;
};

exports.googleEntityAnalysisAPIPack = googleEntityAnalysisAPIPack;

//
// var googleEntityAnalysisEndpoint =  function (req, res) {
//
//
//     var responseData = Object();
//     responseData.processed = "true";
//     responseData.phrase = phrase;
//     responseData.result = {score: 1};
//     var sendDate = (new Date()).getTime();
//
//     if (phrase != undefined && phrase.length > 0) {
//
//       responseData.inputDataPresent = "true";
//
//       // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document
//       doc.detectEntities(config, function (err, entities) {
//           var receiveDate = (new Date()).getTime();
//           var responseTimeMs = receiveDate - sendDate;
//           responseData.apiTime = responseTimeMs;
//           responseData.result = Object();
//           // console.log("entities = "+JSON.stringify(entities));
//           var resultObject;
//           if (err) {
//             console.log('error:', err);
//             responseData.result.score = -1;
//             resultObject = err;
//           }
//           else {
//             var count = 0;
//             var entityTypes = ['people', 'places', 'organizations', 'goods', 'events'];
//             for (t in entityTypes) {
//               var type = entityTypes[t];
//               if (entities[type] != undefined && entities[type].length > 0) {
//                 count += entities[type].length
//               }
//             }
//             responseData.result.score = count;
//             resultObject = entities;
//           }
//
//           responseData.serverResponse = resultObject;
//
//
//           res.setHeader('Content-Type', 'application/json');
//           res.send(JSON.stringify(responseData));
//         });
//     }
//     else {
//         var receiveDate = (new Date()).getTime();
//         var responseTimeMs = receiveDate - sendDate;
//         responseData.apiTime = responseTimeMs;
//         result.inputDataPresent = "false";
//         res.setHeader('Content-Type', 'application/json');
//         res.send(JSON.stringify(result));
//     }
//
// };
// exports.googleEntityAnalysisEndpoint = googleEntityAnalysisEndpoint;
