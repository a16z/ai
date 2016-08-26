//Node.js express
var express = require('express');
// var log = require('log')
var fs = require('fs');

// cookies see https://github.com/expressjs/cookie-parser
var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');

var Twitter = require('twitter');

//local modules (JS files)
// var utils = require('./utils');

createEJSTemplateDataDictionary = function (req, res) {
  return { session: req.session, activeRoute: req.activeRoute };
}

//storage
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);

// #sentiment.js see https://github.com/thisandagain/sentiment
var sentimentJS = require('sentiment');

//see https://github.com/thinkroth/Sentimental
var sentimentalAnalyze = require('Sentimental').analyze,
    sentimentalPositivity = require('Sentimental').positivity,
    sentimentalNegativity = require('Sentimental').negativity;

var app = express();

app.set('port', (process.env.PORT || 5000));

var cookiesSecretKey = (process.env.COOKIES_SECRET_KEY || 'cookiesSecret');

app.use(cookieParser(cookiesSecretKey));

//for now use cookie session (in-memory)
app.use(session({  secret: cookiesSecretKey }));

//
// app.use(session({
//     store: new RedisStore(options),
//     secret: 'secret data'
// }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//add current route to the request so templates can extract it
app.use(function(req, res, next) {
    req.activeRoute = req.path.split('/')[1] // [0] will be empty since routes start with '/'
    next();
});

//add a check for signed in cookies to all routes
app.use(function (req, res, next) {

//don't do this check for the login page, login processing, or the about page
//(about page has two versions, one signed in, one signed out)
  if (req.originalUrl != "/login"
          && req.originalUrl != "/loginCheck"
          && req.originalUrl != "/about") {
    var signedIn = req.cookies.a16zAIKey;

    if (signedIn !== "ok") {
      // console.log('not signed in');
      req.session.signedIn = undefined
        res.redirect("/login");
        return;
    }
    else {
      req.session.signedIn = "yes"
    }
  }

  next();

});


// var emojiMappings = { 'love' : &1F601; /*😍*/, 'happiest' : 😂, 'veryhappy' : 😆,'quitehappy' : 😃, "happy" : 😊,
// "neutral" : 😒,
//                       'hate' : 😡, 'unhappiest' : 😤, 'veryunhappy' : 😭,'quiteunhappy' : 😥, "unhappy" : 😩,
//
//                     };
var emojiMappings = { 'love' : "&#x1F60D", 'happiest' : "&#x1F602", 'veryhappy' : "&#x1F606",'quitehappy' : "&#x1F604", "happy" : "&#x1F603",
"neutral" : '&#x1F60C;',
                      'hate' : '&#x1F632', 'unhappiest' : '&#x1F624', 'veryunhappy' : '&#x1F62D','quiteunhappy' : '&#x1F625', "unhappy" : '&#x1F620',

                    };

mapNumberToEmoji = function(number) {

  if (number == 0)  {
    return emojiMappings['neutral'];
  }

  if (number > 5) {
    return emojiMappings['love'];
  }
  else if (number >= 5 ) {
    return emojiMappings['happiest'];
  }
  if (number >= 3 ){
    return emojiMappings['veryhappy'];
  }
  else if (number >= 2) {
    return emojiMappings['quitehappy'];
  }
  else if (number >= 1) {
    return emojiMappings['happy'];
  }

   if (number < -5) {
    return emojiMappings['hate'];
  }
  else if (number <= -5) {
    return emojiMappings['unhappy'];
  }
  else if (number <= -3) {
    return emojiMappings['quiteunhappy'];
  }
  if (number <= -2) {
    return emojiMappings['veryunhappy'];
  }
  else if (number <= -1) {
    return emojiMappings['unhappiest'];
  }

  return emojiMappings['neutral'];
};

//docs route catch-all
app.get('/docs/*', function(req, res) {
  var docPath = __dirname + '/views'+'/pages'+req.path+".ejs";
  var canProceed = false;
  try {
    var file = fs.statSync(docPath);
    canProceed = file.isFile();
  } catch (error) {

    }

    if (!canProceed) {
      console.log("Requested docs path "+docPath+ " not found.");
      res.redirect('/404');
      return;

    }

  res.render('pages'+req.path, createEJSTemplateDataDictionary(req, res));

});

app.get('/about', function(req, res) {
  res.render('pages/about', createEJSTemplateDataDictionary(req, res));
});

app.get('/login', function(req, res) {
  res.render('pages/login', createEJSTemplateDataDictionary(req, res));
});

app.get('/logout', function (req, res) {
  res.cookie("a16zAIKey",'');
  req.session.signedIn = undefined
  req.session.loginError = undefined
  res.redirect("/");
});

app.post('/loginCheck', function (req, res) {
  // console.log("phrase = "+req.body.secretKey);
  var secretKey = req.body.secretKey;
  var redirectPath = "/";
  if (secretKey == process.env.A16Z_AI_SECRET_KEY) {
    //set the cookie, redirect to /
    res.cookie("a16zAIKey",'ok');
  }
  else {
    //redirect to / with an error
    redirectPath = "/login";
    if (secretKey.length > 0) {
      req.session.loginError = "Invalid Key"
    }
  }

  res.redirect(redirectPath);
});



app.get('/', function(req, res) {
  res.render('pages/index', createEJSTemplateDataDictionary(req, res));
});

app.get('/test/twitter/sentiment', function (req, res) {

     var client = new Twitter({
     consumer_key: process.env.TWITTER_CONSUMER_KEY,
     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
     access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
   });


  var screenName = 'withfries2'; //default
  var screenNameParam = req.query.screenName;
  if (screenNameParam != undefined && screenNameParam.trim().length > 0) {
    screenName = screenNameParam.trim();
  }
  var defaultResultsCount = 25;

    var apiRoute = 'statuses/user_timeline';
    var params = {screen_name: screenName, count: defaultResultsCount};

  var checkMentions = false;

  if (req.query.checkMentions == "true") {
    // https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=2
    checkMentions = true;
    apiRoute = 'search/tweets';
    params = { q: ("@"+screenName), count: defaultResultsCount};
  }

  /*
  search results also include
  search_metadata:     { completed_in: 0.042,  max_id: 769203907067277300,
  max_id_str: '769203907067277312',
  next_results: '?max_id=769158202504118271&q=%40withfries2&include_entities=1',
  query: '%40withfries2',
  refresh_url: '?since_id=769203907067277312&q=%40withfries2&include_entities=1',
  count: 15,
  since_id: 0,
  since_id_str: '0' } }
  */

  client.get(apiRoute, params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);

      var dataDict =  createEJSTemplateDataDictionary(req, res);

      //when doing a search the result is in the statuses entry of the response object
      var tweetsToCheck = checkMentions ? tweets.statuses : tweets;

      var analyzedTweets = [];
      for (num in tweetsToCheck) {
        var tweet = tweetsToCheck[num];
        var text = tweet.text;
        var postedBy = tweet.user;
        if (text != undefined && text.length > 0) {
          var tweetText = tweet.text;
          var sentimental = sentimentalAnalyze(tweetText);
          sentimental.emoji = mapNumberToEmoji(sentimental.score);
          var sentiment = sentimentJS(tweetText);
          sentiment.emoji = mapNumberToEmoji(sentiment.score);

          var average = Object();
          average.score = (sentimental.score + sentiment.score) / 2;
          average.emoji = mapNumberToEmoji(average.score);

          var aTweet = { text: tweetText, 'average' : average, 'sentimental': sentimental, 'sentimentJS': sentiment, user: postedBy};
          analyzedTweets.push(aTweet);
        }
        else {
          console.log("text length 0 or nil");
        }

      }
      dataDict.tweets = analyzedTweets;
      dataDict.screenName = screenName;
      dataDict.checkMentions = checkMentions;
      res.render('pages/tweet-sentiment', dataDict);


    }
  });
});


app.get('/test/phrase/sentiment',
    function (req, res) {
      var dataDict =  createEJSTemplateDataDictionary(req, res);
      res.render('pages/phrase-sentiment', dataDict);

    });

app.post('/test/phrase/sentiment/analyze',
    function (req, res) {

      var phrase = req.body.phrase;

      var result = Object();
      result.processed = "true";
      result.phrase = phrase;
      result.results = [];
      res.setHeader('Content-Type', 'application/json');

      if (phrase != undefined && phrase.length > 0) {
          var sentimentJSResult = sentimentJS(phrase); 
          sentimentJSResult.apiName = "sentimentJS";
          result.results.push(sentimentJSResult);

          var sentimentalResult = sentimentalAnalyze(phrase); 
          sentimentalResult.apiName = "sentimental";
          result.results.push(sentimentalResult);

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

      res.send(JSON.stringify(result));

    });



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.render('pages/error', createEJSTemplateDataDictionary(req, res));
});
