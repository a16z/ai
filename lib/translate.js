var NXAPIPacks = require('./api-connector/api-connector.js');

const najax = require('najax');

const EmojiFunctions = require('./emoji.js');


//Google

var googleTranslateAPIPack = function (apiInfo, packType) {

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

      // var translate = require('google-cloud/translate');

      // var translateClient = translate({
      //   key: 'AIzaSyAbKL9Vq_XdXIIVwJDkyMcJmUOxfwQwWrE'
      // });
      var translateClient = serverPack.gcloud.translate({key: 'AIzaSyAbKL9Vq_XdXIIVwJDkyMcJmUOxfwQwWrE'});
      var config = { verbose: true }; // Get more detailed results



      serverPack.gcloudParameters = {
        // language: language,
        doc: phrase,
        config: config
      };

      serverPack.translateClient = translateClient;

      serverPack.setReady(true);
    }
    else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {
    // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document

    var language = serverPack.translateClient;
    var doc = serverPack.gcloudParameters.doc;
    var config = serverPack.gcloudParameters.config;


    serverPack.translateClient.detect(doc, function (err, results) {

        // console.log("entities = "+JSON.stringify(entities));
        var resultObject;
        if (err) {
          console.log('error:', err);
          apiResponse.result.score = -1;
          resultObject = err;
        }
        else {

          // results = {
    //   language: 'en',
    //   confidence: 1,
    //   input: 'Hello'
    // }
          var count = 0;
          apiResponse.result.score = results.language;
          resultObject = results;
        }

        apiResponse.serverResponse = resultObject;


        completion(apiResponse);
    });
  });

  return entitypack;
};

exports.googleTranslateAPIPack = googleTranslateAPIPack;
