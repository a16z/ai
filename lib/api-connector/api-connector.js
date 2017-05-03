/**
    NXAPIPacks and API connector v 0.8.1

    The MIT License (MIT)

    Copyright (c) 2016 Diego Doval

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
 */

const najax = require('najax');

var NXAPIConnector = function () {

        var rootURL = "/api/";
        var nodeJSApp = new Object();

        var allAPIs = [];
        var allAPIsById = Object.create(null);

        //public vars
        var allAPIPacks = [];

         // Create an object without a prototype so that we don't run into any cache-key
         // conflicts with native Object.prototype properties.
         var apiPacksById = Object.create(null);
         var apiPacksByType = Object.create(null);

        //private functions
        function privateFunction() {
            console.log( "Name:" + privateVar );
        }

        function setAPIRoot(apiRoot) {
          rootURL = apiRoot;
        }
        function setApp(app) {
          nodeJSApp = app;
        }

        var apiConnector = this;

        var addAPI = function(apiInfo) {
          api = NXAPIInfo(apiInfo);

          if (allAPIsById[api.id] != null) {
            console.log("ERROR: api already registered for apiInfo=["+JSON.stringify(apiInfo)+"]");
            return null;
          }

          allAPIsById[api.id] = api;
          allAPIs.push(api);

          console.log("Registered API ID ["+api.id+"] for ["+api.name+"]. Total APIs = "+allAPIs.length);

          return api;
        };

        var apiForId = function(apiId) {
            return allAPIsById[apiId];
        }

        //returns an array of API ids that support the service type passed
        var apisForServiceType = function(serviceType) {

          var apiIds = [];
          if (serviceType == undefined) {
            console.log("Requested apisForServiceType undefined.");
          }
          else {
            if (apiPacksByType[serviceType] != undefined) {
              for (id in apiPacksByType[serviceType]) {
                apiIds.push(apiPacksByType[serviceType][id]);
              }
            }
          }
          return apiIds;
        };

        //public functions

        // NOTE: passes [this] to onSuccess and also returns [this] for method chaining.
        //both endpointURL and nodeApp can be null and it will use those set in the object
        var addAPIPack = function(apiInfo, apiPack, completion, endpointURL, nodeApp) {
          var id = apiInfo.id;

          var type = apiPack.type;

          if (id == undefined || type == undefined
                || (typeof apiPack.createServerPack != 'function') || (typeof apiPack.createClientPack != 'function')) {
            completion(apiPack, false, "Required type, id, serverPack and clientPack. Type ["+type+"] and ID ["+id+"].");
            return;
          }

          if (type == id) {
            completion(apiPack, false, "Error, type and id must be different. Type ["+type+"] and ID ["+id+"].");
            return;
          }

          if (apiPacksById[id] != undefined && apiPacksById[id][type] != undefined) {
            completion(apiPack, false, "Type ["+type+"] already exists for ID ["+id+"].");
            return;
          }


          var byId = apiPacksByType[type];
          if (byId == undefined) {
              byId = Object.create(null);
          }
          byId[id] = apiPack;
          apiPacksByType[type] = byId;


          var byType = apiPacksById[id];
          if (byType == undefined) {
              byType = Object.create(null);
          }
          byType[type] = apiPack;
          apiPacksById[id] = byType;


          allAPIPacks.push(apiPack);

          //automatic registering of endpoint registers  /api/id/type
          var url = (endpointURL != undefined) ? endpointURL : (rootURL + "/" + id + "/" + type);
          var app = (nodeApp != undefined) ? nodeApp : nodeJSApp;

          apiPack.setEndpointURL(url);

          app.post(url, function (req, res) {
            prepareAPIPack(id, type, req, res).execute();
          });

          // NOTE: here [this] does not refer to the instance --
          // it refers to the public API that was revealed. Therefore, method
          // chaining can only work in conjunction with other public methods.
          completion(apiPack, true, "API pack ID=["+id+"] and type=["+type+"] added successfully.\n\tConnected to endpoint ["+url+"]");

          return (this);

        };

        var prepareAPIPack = function(packId, packType, req, res) {
          var id = packId;
          var type = packType;
          var inputOk = false;

          var baseAPIResponse = Object();
          baseAPIResponse.error = "Unknown";
          baseAPIResponse.executedAPI = "false";
          baseAPIResponse.phrase = "";
          baseAPIResponse.result = { score: 0 };

          if (apiPacksById[id] == undefined || apiPacksById[id][type] == undefined) {
            baseAPIResponse.error = "Error preparing pack. API Pack does not exist for type ["+type+"] and ID ["+id+"].";
            baseAPIResponse.processed = false;
          }
          else {
            baseAPIResponse.processed = true;
          }

          var startDate = (new Date()).getTime();

          if (!baseAPIResponse.processed) {
            var execute = function() {
              baseAPIResponse.apiTime = 0;
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(baseAPIResponse));
            };


            return ({
                id: id,
                type: type,
                execute: execute
              });
          }

          var clientPack = apiPacksById[id][type].createClientPack();
          var serverPack = apiPacksById[id][type].createServerPack();

          //process the request and input. If errors, it will set the 'ready' flag to false
          serverPack.initialize(req, res, baseAPIResponse);

          var execute = function() {

            if (serverPack.isReady()) {
              // console.log("API ServerPack ready for id ["+id+"] / type ["+type+"].");

              var sendDate = (new Date()).getTime();
              serverPack.execute(baseAPIResponse, function(finalAPIResponse) {
                //completion gets called regardless of error or not, data is in responseData object
                var receiveDate = (new Date()).getTime();
                var responseTimeMs = receiveDate - sendDate;
                finalAPIResponse.apiTime = responseTimeMs;
                baseAPIResponse.executedAPI = "true";

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(finalAPIResponse));
              });
            }
            else {
              console.log("Error. API ServerPack for id ["+id+"] / type ["+type+"] not ready.");

              baseAPIResponse.apiTime = 0;
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify(baseAPIResponse));
            }
          }

          return ({
              id: id,
              type: type,
              execute: execute,
              clientPack: clientPack,
              serverPack: serverPack
          });
        }


        return {
            setApp: setApp,
            setAPIRoot: setAPIRoot,
            addAPI: addAPI,
            apiForId : apiForId,
            getApisForServiceType: apisForServiceType,
            addAPIPack: addAPIPack,
            preparePack: prepareAPIPack
        };

    }();


exports.connector = NXAPIConnector;


var NXAPIInfo = function (apiParams) {

  var _provider = apiParams.provider; //eg: "IBM",
  var _id = apiParams.id; //eg: "ibm-alchemy"
  var _name = apiParams.name; // eg "IBM Alchemy API"
  var _description = apiParams.description; // eg "IBM Alchemy API"
  var _providerUrl = apiParams.providerUrl; //eg: "http://www.ibm.com/watson/developercloud/alchemy-language.html",
  var _consoleUrl = apiParams.consoleUrl; //eg: "https://console.ng.bluemix.net",
  var _officialGithubURL = apiParams.officialGithubURL; //eg: "https://github.com/watson-developer-cloud/alchemylanguage-nodejs",
  var _unofficialGithubURL = apiParams.unofficialGithubURL; //eg: "",

  //use an empty prototype to avoid having to check _services.hasOwnProperty later
  var _services = Object.create(null);

  //endpointURL, nodeApp are optional, typically set globally in the connector object
  function _addService(serviceInfo, apiPack, apiAddCompletion, endpointURL, nodeApp) {

    var service = {
      id: serviceInfo.id,
      name : serviceInfo.name,
      description : serviceInfo.description,
      contentType : serviceInfo.contentType,
      xtra : serviceInfo.xtra,
      testSamples : serviceInfo.testSamples
    };

    //create the APIPack object
    var apiPack = apiPack(this, service);
    var completion = apiAddCompletion;
    console.log("Adding service ="+service.id+" to API ["+_id+"]");

    NXAPIConnector.addAPIPack(this, apiPack, completion, endpointURL, nodeApp);
    service.endpointURL = apiPack.getEndpointURL();
    _services[service.id] = service;


    console.log("Added service ["+service.id+"] ("+service.name+") to API ["+_id+"].")

    return (this);
  }

  function _allServiceIds() {
    var allIds = [];
    for (i in _services) {
      allIds.push(_services[i].id);
    }
    return allIds;
  }

  function _getServiceInfo(serviceId) {
    return _services[serviceId];
  }

  return ({
    provider: _provider,
    id: _id,
    name: _name,
    description: _description,
    addService: _addService,
    allServiceIds: _allServiceIds,
    getServiceInfo: _getServiceInfo
  });
};

exports.apiInfo = NXAPIInfo;

function NXAPIPack(apiInfo, serviceInfo) {
  var api = apiInfo;

  var service = serviceInfo;
  var type = serviceInfo.id;
  var _endpointURL;
  var apiInitialize = function(serverPack, req, res, baseAPIResponse) { console.log("Called empty serverInitialize for API type=["+packType+"] / API id=["+api.id+"]")};
  var apiExecute = function(serverPack, apiResponse, completion) { console.log("Called empty serverExecute for API type=["+packType+"] / API id=["+api.id+"]")};

  var _setEndpointURL = function (endpointURL) {
    _endpointURL = endpointURL;
  }
  var _getEndpointURL = function () {
    return _endpointURL;
  }
  var _setAPIFunctionInitialize = function(apiInit) {
    apiInitialize = apiInit;
  }
  var _setAPIFunctionExecute = function(apiExec) {
    apiExecute = apiExec;
  }

  var serverPack = function() {
    var ready = false;
    var recaptchaOk = false;
    var _isReady = function() { return ready; };
    var _setReady = function(value) { ready = value; };
    var _isRecaptchaOk = function() { return recaptchaOk; };
    var _setRecaptchaOk = function(value) { recaptchaOk = value; };

    var checkRecaptcha = function (recaptchaResponse, remoteIp, completion) {
        // var recaptchaResponse = req.body.gRecaptchaResponse;
        //
        // var remoteIp = req.connection.remoteAddress;
        var queryString = encodeURI("secret="+process.env.RECAPTCHA_SECRET_KEY+"&response="+recaptchaResponse+"&remoteip="+remoteIp);

        najax({
            url: "https://www.google.com/recaptcha/api/siteverify",
            type: "POST",
            dataType: "json",
            data: queryString
         })
          .done(function(response) {
              //response includes timestamp  "challenge_ts": "2017-01-04T00:11:06Z",

              _setRecaptchaOk((response == undefined || response.success == undefined) ? false : response.success);
            //   console.log("val = "+response.success);
            //   console.log("val2 = "+_isRecaptchaOk());
              completion();
          })
            .fail(function(err) {
                _setRecaptchaOk(false);
                completion();
            });

    }

    var initialize = function (req, res, baseAPIResponse) {
      apiInitialize(this, req, res, baseAPIResponse);
    };

    var execute = function(apiResponse, completion) {
      apiExecute(this, apiResponse, completion);
    };

    return ({
      api: api,
      type: type,
      isReady: _isReady,
      setReady : _setReady,
      isRecaptchaOk: _isRecaptchaOk,
      initialize: initialize,
      checkRecaptcha: checkRecaptcha,
      execute: execute
    });
  };

  var clientPack = function() {
    var endPointURL = _getEndpointURL();

    return {
      api: api,
      type: type,
      url: endPointURL
    };

  };

  return {
    api: api,
    type: type,
    setAPIFunctionInitialize: _setAPIFunctionInitialize,
    setAPIFunctionExecute: _setAPIFunctionExecute,
    setEndpointURL: _setEndpointURL,
    serviceInfo: service,
    getEndpointURL: _getEndpointURL,
    createServerPack: serverPack,
    createClientPack: clientPack
  };

};

exports.NXAPIPack = NXAPIPack;
