//currently disabled in main app

var Twitter = require('twitter');

exports.addTwitterRoute = function(app) {

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
              var sentimental = SentimentAnalysis.sentimentalAnalyze(tweetText);
              sentimental.emoji = Emoji.mapNumberToEmoji(sentimental.score);
              var sentiment = SentimentAnalysis.sentimentJS(tweetText);
              sentiment.emoji = Emoji.mapNumberToEmoji(sentiment.score);

              var average = Object();
              average.score = (sentimental.score + sentiment.score) / 2;
              average.emoji = Emoji.mapNumberToEmoji(average.score);

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
};
