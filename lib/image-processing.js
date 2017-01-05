
var express = require('express');
// var log = require('log')
var fs = require('fs');

var path = require("path");

//on examples, if displayText is not included the value will be used
//path assumed to be from root dir of app
var imageAnalysisExamples = [
  { "value": "public/data/services/image-analysis/city-skyline-001.jpg",
    "id": "city-skyline-001.jpg",
    "labels": "city, skyline",
    "notes": "JPEG Compression (Medium)"},
  { "value": "public/data/services/image-analysis/protest-001.jpg",
    "id": "protest-001.jpg",
    "labels": "protest, demonstration, sign",
    "notes": "JPEG Compression (Medium)"},
  { "value": "public/data/services/image-analysis/protest-002.jpg",
    "id": "protest-002.jpg",
    "labels": "protest, demonstration, sign",
    "notes": "JPEG Compression (Medium)"},
  { "value": "public/data/services/image-analysis/sign-001.jpg",
    "id": "sign-001.jpg",
    "labels": "sign, street sign",
    "notes": "JPEG Compression (Very High)"},
  { "value": "public/data/services/image-analysis/sign-002.jpg",
    "id": "sign-002.jpg",
    "labels": "sign, street sign",
    "notes": "JPEG Compression (Very High)"},
];
exports.registerEndpoints = function(app, upload) {

    //TODO move to share lib code
    var createEJSTemplateDataDict = function (req, res) {
      return { session: req.session, activeRoute: req.activeRoute };
    }

    var gcloud_pid = process.env.GCLOUD_PROJECT;
    var privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n');
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
      var dataDict =  createEJSTemplateDataDict(req, res);
      var renderText = "";
      renderText += "<h1>Cloud Vision Start</h1>";
      dataDict.errorText = renderText;
      dataDict.results = "";
      dataDict.imgData = "";
      dataDict.sampleImages = [];
      for (i in imageAnalysisExamples) {
        var imgPath = path.join(process.cwd(), imageAnalysisExamples[i].value);
        var jsonInfo = image2json.NXImage.jsonImageFromFile(imgPath);
        dataDict.sampleImages.push(jsonInfo);
      }

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


};
