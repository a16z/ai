
var express = require('express');
// var log = require('log')
var fs = require('fs');

var path = require("path");

var showdown  = require('showdown');
showdown.setFlavor('github');
var converter = new showdown.Converter();

exports.processMarkdownPage = function(dataDict, req, res, markdownCache) {

    // var docPath = __dirname + '/views'+'/pages'+req.path+".ejs";
    var docPath = path.join(process.cwd(), "src", req.path + ".md");

    var canProceed = false;
    try {
        var file = fs.statSync(docPath);
        canProceed = file.isFile();
    }
    catch (error) {
        console.log("EJS Path not found = "+error);
    }

    if (!canProceed) {
      console.log("Requested docs path "+docPath+ " not found.");
      res.redirect('/404');
      return;

    }


    var markdownAsHTML = markdownCache[docPath];
    var breadcrumbsData = Object.create(null);
    var hasBreadcrumbs = false;


    if (markdownAsHTML == undefined || markdownAsHTML == null) {
      markdownAsHTML = "";
      var loadingBreadcrumbs = false;
      try {
          var mdFile = fs.statSync(docPath);
          if (mdFile.isFile()) {
              var fileMd =  fs.readFileSync(docPath, 'utf8');
              markdownAsHTML = converter.makeHtml(fileMd);
          }

          loadingBreadcrumbs = true;
          var mdJson = path.join(process.cwd(), "src", req.path);

          breadcrumbsData = require(mdJson);

          if (breadcrumbsData.prev && breadcrumbsData.next) {
              hasBreadcrumbs = true;
          }
      }
      catch (error) {
          //before loading breadcrumbs we ignore this error,
          //if the .md file isn't there we just don't include it
          if (loadingBreadcrumbs) {
                console.log("Error reading breadcrumb JSON: "+error);
          }
      }
    }

    dataDict['markdownContent'] = markdownAsHTML;
    dataDict['hasBreadcrumbs'] = hasBreadcrumbs;
    if (hasBreadcrumbs) {
      dataDict['breadcrumbs'] = breadcrumbsData;
    }

    var docPath = path.join(process.cwd(), "views", "pages", "section-template.ejs");
    res.render(docPath, dataDict); //path was 'pages'+req.path


};
