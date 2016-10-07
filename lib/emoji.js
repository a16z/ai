
// var emojiMappings = { 'love' : &1F601; /*😍*/, 'happiest' : 😂, 'veryhappy' : 😆,'quitehappy' : 😃, "happy" : 😊,
// "neutral" : 😒,
//                       'hate' : 😡, 'unhappiest' : 😤, 'veryunhappy' : 😭,'quiteunhappy' : 😥, "unhappy" : 😩,
//
//                     };
var emojiMappings = { 'love' : "&#x1F60D", 'happiest' : "&#x1F602", 'veryhappy' : "&#x1F606",'quitehappy' : "&#x1F604", "happy" : "&#x1F603",
"neutral" : '&#x1F60C;',
                      'hate' : '&#x1F632', 'unhappiest' : '&#x1F624', 'veryunhappy' : '&#x1F62D','quiteunhappy' : '&#x1F625', "unhappy" : '&#x1F620',

                    };

exports.emojiMappings = emojiMappings;

exports.mapNumberToEmoji = function(number) {

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
