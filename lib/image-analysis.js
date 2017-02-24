var NXAPIPacks = require('./api-connector/api-connector.js');
var image2json = require('./nx/image2json.js');
var NXIMage = image2json.NXImage;
var fs = require('fs');

var AWS = require('aws-sdk');

//used for MS APIs
const najax = require('najax');


//Google

var googleImageAnalysisAPIPack = function(apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var image = req.body.image;

    if (image != undefined && image.dataURI != undefined) {

      baseAPIResponse.inputDataPresent = "true";
    //   baseAPIResponse.image = image;

      var gcloud_pid = process.env.GCLOUD_PROJECT;
      var privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n');
      var clientEmail = process.env.GOOGLE_CLOUD_EMAIL;

      serverPack.gcloudConfig = {
        projectId: gcloud_pid,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey
        }
      };

      serverPack.gcloud = require('google-cloud')(serverPack.gcloudConfig);

      var vision = serverPack.gcloud.vision();

      serverPack.gcloudParameters = {
        // language: language,
        image: image
        // config: config
      };

      serverPack.visionClient = vision;

      serverPack.setReady(true);
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {


    // var config = serverPack.gcloudParameters.config;

    var types = ['labels', 'landmarks', 'logos', 'properties', 'safeSearch', 'text', 'faces'];
    var optionsDict = new Object();
    optionsDict.types = types;
    optionsDict.verbose = true;

    var buffer = NXIMage.bufferFromJsonImage(serverPack.gcloudParameters.image);

    serverPack.visionClient.detect(buffer, optionsDict, function(err, detections) {
      var renderText = "";

      if (err) {
        console.log("Image processing error."+err);
        renderText += "<h1>Cloud Vision Error</h1>";
        console.log('error:', err);
        // apiResponse.result.score = -1;
        resultObject = err;
      }
      else {
          apiResponse.result.score = (detections.labels == undefined) ? 0 : detections.labels.length;
        resultObject = detections;
      }

      apiResponse.serverResponse = resultObject;


      completion(apiResponse);

    });


  });

  return entitypack;
};

exports.googleImageAnalysisAPIPack = googleImageAnalysisAPIPack;


//Clarifai
var Clarifai = require('clarifai');

var clarifaiImageAnalysisAPIPack = function(apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var image = req.body.image;

    if (image != undefined && image.dataURI != undefined) {

      baseAPIResponse.inputDataPresent = "true";
    //   baseAPIResponse.image = image;

    var clarifaiClient = new Clarifai.App(
      process.env.CLARIFAI_CLIENT_ID,
      process.env.CLARIFAI_CLIENT_SECRET
    );

    serverPack.clarifaiClient = clarifaiClient;

      serverPack.parameters = {
        // language: language,
        image: image
        // config: config
      };


      serverPack.setReady(true);
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {



    var base64Str = NXIMage.base64StringFromJsonImage(serverPack.parameters.image);

    serverPack.clarifaiClient.models
        .predict(Clarifai.GENERAL_MODEL, base64Str).then(
            function(response) {
                if (response.outputs.length > 0 && response.outputs[0].data.concepts != undefined) {
                    apiResponse.result.score = response.outputs[0].data.concepts.length;
                }
                apiResponse.serverResponse = response;
                completion(apiResponse);
            },
            function(err) {
                apiResponse.serverResponse = err;
                completion(apiResponse);
            }
        );



  });

  return entitypack;
};

exports.clarifaiImageAnalysisAPIPack = clarifaiImageAnalysisAPIPack;


//MS Azure

var msAzureImageAnalysisAPIPack = function(apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var image = req.body.image;

    if (image != undefined && image.dataURI != undefined) {

      baseAPIResponse.inputDataPresent = "true";
    //   baseAPIResponse.image = image;

         serverPack.params = {
                   // Request parameters
                   "language": "unk",
                   "detectOrientation ": "true",
               };
      serverPack.data = {
        // language: language,
        image: image
        // config: config
      };

    var azureCognitiveApiKey = process.env.MS_AZURE_COMPUTER_VISION_KEY;
    serverPack.azureCognitiveApiKey = azureCognitiveApiKey;

      serverPack.setReady(true);
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {


      var visualFeatures = "Categories,Tags,Description,Color"
    var buffer = NXIMage.bufferFromJsonImage(serverPack.data.image);
    var visionURL = "https://api.projectoxford.ai/vision/v1.0/analyze/?visualFeatures="+visualFeatures+"&language=en";

        najax({
            url: visionURL,
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", serverPack.azureCognitiveApiKey);
            },
            type: "POST",
            'processData': false,
            data: buffer,
        })
        .done(function(resp) {
            var response = JSON.parse(resp);
          apiResponse.serverResponse = response;
          apiResponse.result.score = (response.tags == undefined) ? 0 : response.tags.length;

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

exports.msAzureImageAnalysisAPIPack = msAzureImageAnalysisAPIPack;

// Amazon
var amazonImageAnalysisAPIPack = function(apiInfo, packType) {

  var entitypack = new NXAPIPacks.NXAPIPack(apiInfo, packType);

  entitypack.setAPIFunctionInitialize(function(serverPack, req, res, baseAPIResponse) {

    var image = req.body.image;

    if (image != undefined && image.dataURI != undefined) {

      baseAPIResponse.inputDataPresent = "true";

      var rek  = new AWS.Rekognition({region: 'us-west-2'});
      serverPack.rek = rek;

      serverPack.amazonParameters = {
        image: image
      };

      serverPack.setReady(true);
    } else {
      baseAPIResponse.error = "Error processing input data.";
    }

  });

  entitypack.setAPIFunctionExecute(function(serverPack, apiResponse, completion) {

  var buffer = NXIMage.bufferFromJsonImage(serverPack.amazonParameters.image);

  var params = {
    Image: {
      Bytes: buffer
    },
    MaxLabels: 100,
    MinConfidence: 0.0
  };

    serverPack.rek.detectLabels(params, function(err, data) {
      var renderText = "";

      if (err) {
        console.log("Image processing error."+err);
        renderText += "<h1>Cloud Vision Error</h1>";
        console.log('error:', err);
        resultObject = err;
      }
      else {
        apiResponse.result.score = ((data.Labels == undefined) ? 0 : data.Labels.length);
        resultObject = data;
      }

      apiResponse.serverResponse = resultObject;

      completion(apiResponse);

    });

  });

  return entitypack;
};

exports.amazonImageAnalysisAPIPack = amazonImageAnalysisAPIPack;
