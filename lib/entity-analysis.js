

var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');

var alchemyEntityAnalysisEndpoint = function (req, res) {

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
          console.log("entities = "+JSON.stringify(entities));
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
