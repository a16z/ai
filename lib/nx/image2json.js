/**
    Image2JSON v0.3

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

 var util = require('util');
 var fs = require('fs');
 var mime = require('mime');
 var path = require("path");
 var temp_dir = path.join(process.cwd(), 'temp/');
 var jsonfile = require('jsonfile');

 var NXImage = function() {

   function exportImageFileToTempJSON(sourceFilePath) {
     var imageJSON = jsonImageFromFile(sourceFilePath);
     var jsonFilename = path.basename(sourceFilePath) + '.json';
     var tmpPath = path.join(temp_dir, jsonFilename);

     jsonfile.writeFile(tmpPath, imageJSON, {spaces: 2}, function(err) {
       console.error("Error writing image to JSON. \nsourcePath="+sourceFilePath+"\n+targetPath="+tmpPath+"\nError:\n"+err+"\n[END] -- Error writing image to JSON");
     })

     return tmpPath;
   }

   function base64StringFromJsonImage(image) {
       var dataURI = image.dataURI.replace(/\r?\n/g, '');
       var pos = dataURI.indexOf(',');
       var data = unescape(dataURI.substring(pos + 1));
       return data;
   }

   function bufferFromJsonImage(image) {
       var data = base64StringFromJsonImage(image);
       var buf =  new Buffer(data, 'base64');
       return buf;
   }

   function jsonImageFromFile(filePath) {
     var filename = path.basename(filePath);
     var binaryBuf = fs.readFileSync(filePath);
     return jsonImageFromBinaryBuffer(filename, binaryBuf);
   }

   function jsonImageFromBinaryBuffer(name, binaryBuf) {
     var length = binaryBuf.length;
     var data = binaryBuf.toString('base64');
     var type = mime.lookup(name);
     type = (type == undefined) ? "image" : type;
     var dataURI = util.format('data:%s;base64,%s', type, data);
     return {
       name: name,
       dataURI: dataURI, //data encoded with base64
       length: length,
       type: type
     }
   }

   return {
     exportImageFileToTempJSON : exportImageFileToTempJSON,
     jsonImageFromFile: jsonImageFromFile,
     jsonImageFromBinaryBuffer: jsonImageFromBinaryBuffer,
     bufferFromJsonImage: bufferFromJsonImage,
     base64StringFromJsonImage: base64StringFromJsonImage
   };

 }();

exports.NXImage = NXImage;
