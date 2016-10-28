# AI-landscape

## Production URL
The latest non-dev version of this app is running at [Live AI Playground](http://cryptic-alpha.herokuapp.com)

## Releasing to Production
The app is now connected to the A16Z ai github repository and doing automatic deployment when a new version is pushed to the *production* branch. Releasing to a different Heroku app/account requires the appropriate setup, including environment variables (see below).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

### Environment variables

The following environment variables are required (they also have to be setup in the Heroku app's environment when running it there):
```sh
#example: export COOKIES_SECRET_KEY=secretsandcookies
export COOKIES_SECRET_KEY=<secret used for cookies>
export A16Z_AI_SECRET_KEY=<key used to allow login>

#Twitter
export TWITTER_CONSUMER_KEY=<twitter api access>
export TWITTER_CONSUMER_SECRET=<twitter api access>
export TWITTER_ACCESS_TOKEN_KEY=<twitter api access>
export TWITTER_ACCESS_TOKEN_SECRET=<twitter api access>

# Microsoft
export MS_AZURE_COGNITIVE_SERVICES_API_KEY=<MS Azure Cognitive Services API Key>

# IBM Watson/Alchemy/etc (note that different IBM services have different auth requirements)
export IBM_WATSON_TONE_USERNAME=<IBM Tone API Username>
export IBM_WATSON_TONE_PASSWORD=<IBM Tone API Password>
export IBM_ALCHEMY_API_KEY=<IBM Alchemy API Key>
```

For Twitter API Tokens, go [here](https://apps.twitter.com) to create an app and get the appropriate tokens. (see [documentation of the twitter module](https://github.com/desmondmorris/node-twitter) for more info).

These variables must be added as Config Vars to the Heroku app.

Packages used by the app are described in `package.json` and can be installed by running `npm install` on the local root directory of the repository.

```sh
$ npm install
$ npm start
```

The app should now be running on [localhost:5000](http://localhost:5000/).

## Deployment

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Node.js Packages used
### Node.js Cookies
https://github.com/pillarjs/cookies

### najax
Simple jQuery-like calls in Node.js
https://github.com/najaxjs/najax

### sentiment.js
https://github.com/thisandagain/sentiment

### Sentimental
https://github.com/thinkroth/Sentimental

### Twitter API
https://github.com/desmondmorris/node-twitter

### IBM Watson Dev Cloud/Alchemy API
https://www.npmjs.com/package/watson-developer-cloud

### (Unofficial) Node.js API for Microsoft Azure Cognitive Services
https://github.com/joshbalfour/node-cognitive-services

Other links:
https://westus.dev.cognitive.microsoft.com/docs/services/
https://portal.azure.com

## Documentation
