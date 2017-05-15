# AI-Playbook

## Production URL
The latest non-dev version of this app is running at [Live AI Playground](http://aiplaybook.a16z.com/).

## Releasing to Production
Releasing to a Heroku app/account requires the appropriate setup, including environment variables (see below).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

### Environment variables

The following environment variables are required (they also have to be setup in the Heroku app's environment when running it there). These environment variables are obtained from the service provider's respective developer consoles after signing up for their services:
```sh
# Recaptcha
RECAPTCHA_SITE_KEY=<recaptcha site key>
RECAPTCHA_SECRET_KEY=<recaptcha secret key>

# Microsoft
MS_AZURE_COGNITIVE_SERVICES_API_KEY=<MS Azure Cognitive Services API Key>
MS_AZURE_COG_SERVICES_ENTITY_LINKING_API_KEY=<MS Azure Entity Linking API Key>
MS_AZURE_COMPUTER_VISION_KEY=<key>

# IBM Watson/Alchemy/etc (note that different IBM services have different auth requirements)
IBM_WATSON_TONE_USERNAME=<IBM Tone API Username>
IBM_WATSON_TONE_PASSWORD=<IBM Tone API Password>
IBM_ALCHEMY_API_KEY=<IBM Alchemy API Key>

# Google NLP
GCLOUD_PROJECT=<Google Cloud Platform Project ID>
GOOGLE_NLP_API_KEY=<API KEY>
GOOGLE_CLOUD_PRIVATE_KEY="<key>"
GOOGLE_CLOUD_EMAIL="888888888-something@developer.gserviceaccount.com"

# Clarifai
CLARIFAI_CLIENT_ID=<token>
CLARIFAI_CLIENT_SECRET=<secret>

# Recast.ai
RECAST_AI_TOKEN=<token>

# API.ai
API_AI_TOKEN=<token>

# Baidu
BAIDU_TRANSLATION_APP_ID=<token>
BAIDU_TRANSLATION_KEY=<token>

# this is enabled for rate limiting on our production environment
REDIS_URL=redis://<Redis location>
RATE_LIMITING_ENABLED=true
RATE_LIMITING_INTERVAL=<interval>
RATE_LIMITING_REQUESTS=<limit>

```

These variables _must_ be added as Config Vars to the Heroku app. We recommend including all the variables in a `.env` file to be placed in the root directory of the repository and then set in heroku via `heroku config:set VARNAME=value`. Alternatively, the variables can be configured directly on the shell via `export VARNAME=value`.

Packages used by the app are described in `package.json` and can be installed by running `npm install` on the local root directory of the repository.

```sh
$ npm install
$ npm start
```

For config values you can add them directly to the app as follows:
```sh
heroku config:add GOOGLE_CLOUD_PRIVATE_KEY="$GOOGLE_CLOUD_PRIVATE_KEY" --app YOURAPPNAME
```
when variables require quotes, or
```sh
heroku config:add GOOGLE_CLOUD_PRIVATE_KEY=<KEY> --app YOURAPPNAME
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

## Libraries Used

### Recaptcha
https://www.google.com/recaptcha/admin

### najax
Simple jQuery-like calls in Node.js
https://github.com/najaxjs/najax

### sentiment.js
https://github.com/thisandagain/sentiment

### Sentimental
https://github.com/thinkroth/Sentimental

### Recast AI
https://github.com/RecastAI/SDK-NodeJS

### API.ai
https://github.com/api-ai/api-ai-node-js

### IBM Watson Dev Cloud/Alchemy API
https://www.npmjs.com/package/watson-developer-cloud

### Microsoft Azure Cognitive Services
https://portal.azure.com/
https://westus.dev.cognitive.microsoft.com/docs/services/

### (Unofficial) Node.js API for Microsoft Azure Cognitive Services
https://github.com/joshbalfour/node-cognitive-services

### Amazon Rekognition API
https://aws.amazon.com/rekognition/

### Baidu Translation
http://api.fanyi.baidu.com/api/trans/product/index

## Documentation


## Other Software Used

* Bootstrap http://getbootstrap.com
* JQuery http://jquery.com
* JavaScript + Bibtex https://github.com/vkaravir/bib-publication-list
* Showdown https://github.com/showdownjs/showdown
