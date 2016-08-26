# AI-landscape

## Production URL
The latest non-dev version of this app is running at [Live AI Playground](http://cryptic-alpha.herokuapp.com)

## Releasing to Production
The app is now connected to the A16Z ai github repository and doing automatic deployment when a new version is pushed to the *production* branch. 

## Running Locally

To get started, make sure you have all appropriate node.js modules installed.

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

Packages used by the app are described in package.json

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

## Packages used
### Node.js Cookies
https://github.com/pillarjs/cookies

### sentiment.js
https://github.com/thisandagain/sentiment

### Sentimental
https://github.com/thinkroth/Sentimental

### Twitter API
https://github.com/desmondmorris/node-twitter

## Documentation
