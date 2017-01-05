

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var syntaxHighlight = function(json) {

  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {

    var spanClass = "number"; //default

    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        spanClass = "key";
      } else {
        spanClass = "string";
      }
    } else if (/true|false/.test(match)) {
      spanClass = "boolean";
    } else if (/null/.test(match)) {
      spanClass = "null";
    }
    return "<span class=\"" + spanClass + "\">" + match + "</span>";
  });
};

var dataURItoBlob = function(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}
