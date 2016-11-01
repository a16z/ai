
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var NXAPIPacks = require('./api-connector/api-connector.js');

var alchemyEntityAPIPack = function (apiInfo, packType) {
  // var alchemy_language;
  // var alchemy_params;

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {
    console.log("executing custom initialize!!");
    var phrase = req.body.phrase;

    if (phrase != undefined && phrase.length > 0) {
      baseAPIResponse.inputDataPresent = "true";
      entitypack.alchemy_language = new AlchemyLanguageV1({
         "url": "https://gateway-a.watsonplatform.net/calls",
        api_key: process.env.IBM_ALCHEMY_API_KEY
      });

      entitypack.alchemy_params = {
        text: phrase
      };

      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
    console.log("executing custom serverExecute!!");
    console.log('calling alchemy_api:');
    entitypack.alchemy_language.entities(entitypack.alchemy_params, function (err, response) {
      if (err) {
        console.log('alchemy_api error:', err);
        apiResponse.result.score = -1;
        apiResponse.error = "Error received on API call.";
        resultObject = err;
      }
      else {
        console.log(' alchemy_api: ok');
        apiResponse.result.score = response.entities.length;
        resultObject = response;

        apiResponse.serverResponse = resultObject;
      }

      completion(apiResponse);
    });
  });

  return entitypack;
};

//
// var alchemyEntityAPIPack = function (apiInfo, packType) {
//   var api = apiInfo;//"ibm-alchemy";
//   var type = packType;//"entity-analysis";
//
//   var alchemy_language;
//   var alchemy_params;
//
//
//         //testing
//
//   var serverPack = function() {
//     var ready = false;
//     var isReady = function() { return ready; }
//
//     var initialize = function (req, res, baseAPIResponse) {
//
//
//       var phrase = req.body.phrase;
//
//       if (phrase != undefined && phrase.length > 0) {
//         baseAPIResponse.inputDataPresent = "true";
//         ready = true;
//         alchemy_language = new AlchemyLanguageV1({
//            "url": "https://gateway-a.watsonplatform.net/calls",
//           api_key: process.env.IBM_ALCHEMY_API_KEY
//         });
//
//         alchemy_params = {
//           text: phrase
//         };
//       }
//       else {
//
//         baseAPIResponse.error = "Error processing input data.";
//       }
//     };
//
//     var execute = function(apiResponse, completion) {
//       console.log('calling alchemy_api:');
//       alchemy_language.entities(alchemy_params, function (err, response) {
//         if (err) {
//           console.log('alchemy_api error:', err);
//           apiResponse.result.score = -1;
//           apiResponse.error = "Error received on API call.";
//           resultObject = err;
//         }
//         else {
//           console.log(' alchemy_api: ok');
//           apiResponse.result.score = response.entities.length;
//           resultObject = response;
//
//           apiResponse.serverResponse = resultObject;
//         }
//
//         completion(apiResponse);
//
//       });
//     };
//
//     return ({
//       api: api,
//       type: type,
//       isReady: isReady,
//       initialize: initialize,
//       execute: execute
//     });
//
//   };
//
//   var clientPack = function() {
//     console.log("clientpack");
//   };
//
//   return {
//       api: api,
//       type: type,
//       createServerPack: serverPack,
//       createClientPack: clientPack
//   };
// };

exports.alchemyEntityAPIPack = alchemyEntityAPIPack;


var alchemyEntityAnalysisEndpoint = function (req, res) {


  var responseData = Object();
  responseData.processed = "true";
  responseData.phrase = phrase;
  responseData.result = {score: 0};
  var sendDate = (new Date()).getTime();

  var phrase = req.body.phrase;


  if (phrase != undefined && phrase.length > 0) {
    responseData.inputDataPresent = "true";
    var alchemy_language = new AlchemyLanguageV1({
       "url": "https://gateway-a.watsonplatform.net/calls",
      api_key: process.env.IBM_ALCHEMY_API_KEY
    });

    var params = {
      text: phrase
    };

    alchemy_language.entities(params, function (err, response) {
      var receiveDate = (new Date()).getTime();
      var responseTimeMs = receiveDate - sendDate;
      responseData.apiTime = responseTimeMs;
      responseData.result = Object();
      var resultObject;

      if (err) {
        console.log('error:', err);
        responseData.result.score = -1;
        resultObject = err;

      }
      else {
        responseData.result.score = response.entities.length;
        resultObject = response;

      }

      responseData.serverResponse = resultObject;


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

exports.alchemyEntityAnalysisEndpoint = alchemyEntityAnalysisEndpoint;




var googleEntityAnalysisEndpoint =  function (req, res) {

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



    var language = gcloud.language();
    var phrase = req.body.phrase;
    var doc = language.document({content: phrase});
    var config = { verbose: true }; // Get more detailed results

    var responseData = Object();
    responseData.processed = "true";
    responseData.phrase = phrase;
    responseData.result = {score: 1};
    var sendDate = (new Date()).getTime();

    if (phrase != undefined && phrase.length > 0) {

      responseData.inputDataPresent = "true";

      // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document
      doc.detectEntities(config, function (err, entities) {
          var receiveDate = (new Date()).getTime();
          var responseTimeMs = receiveDate - sendDate;
          responseData.apiTime = responseTimeMs;
          responseData.result = Object();
          // console.log("entities = "+JSON.stringify(entities));
          var resultObject;
          if (err) {
            console.log('error:', err);
            responseData.result.score = -1;
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
            responseData.result.score = count;
            resultObject = entities;
          }

          responseData.serverResponse = resultObject;


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
exports.googleEntityAnalysisEndpoint = googleEntityAnalysisEndpoint;
