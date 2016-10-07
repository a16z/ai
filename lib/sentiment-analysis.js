
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





  var googleSentimentAnalysisEndpoint =  function (req, res) {


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

    var doc = language.document({content: "blue skies are cool.", type: "text", language: "en"});

      var config = {
        // Get more detailed results
        verbose: true
      };


        var phrase = req.body.phrase;

        var responseData = Object();
        responseData.processed = "true";
        responseData.phrase = phrase;
        responseData.result = {score: 0.2};
        var sendDate = (new Date()).getTime();

        if (phrase != undefined && phrase.length > 0) {

          responseData.inputDataPresent = "true";

                // See https://googlecloudplatform.github.io/google-cloud-node/#/docs/language/latest/language/document
                doc.detectSentiment(config, function (err, sentiment) {


                  var receiveDate = (new Date()).getTime();
                  var responseTimeMs = receiveDate - sendDate;
                  responseData.apiTime = responseTimeMs;
                  responseData.result = Object();

                  if (err) {
                    console.log('error:', err);
                    responseData.result.score = -1;

                  }
                  else {
                    var multiplier = (sentiment.polarity >= 0) ? 1 : -1;
                    responseData.result.score = sentiment.magnitude * multiplier;
                    // console.log(JSON.stringify(response, null, 2));
                  }

                  responseData.serverResponse = sentiment;


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
exports.googleSentimentAnalysisEndpoint = googleSentimentAnalysisEndpoint;
