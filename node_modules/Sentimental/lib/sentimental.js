var afinn = require('../wordLists/afinn.json');


// Calculates the negative sentiment of a sentence
// -------------------------------------------------- //

function negativity (phrase) {
  var addPush = function(t, score){
    hits -= score;
    words.push(t);
  };
    
  var noPunctuation = phrase.replace(/[^a-zA-Z ]+/g, ' ').replace('/ {2,}/',' '),
      tokens = noPunctuation.toLowerCase().split(" "),
      hits   = 0,
      words  = [];

  tokens.forEach(function(t) {
    if (afinn.hasOwnProperty(t)) {
      if (afinn[t] < 0){
        addPush(t, afinn[t]);
      }
    }
  });

  return {
    score       : hits,
    comparative : hits / tokens.length,
    words       : words
  };
}


// Calculates the positive sentiment  of a sentence
// -------------------------------------------------- //

function positivity (phrase) {
  var addPush = function(t, score){
    hits += score;
    words.push(t);
  };

  var noPunctuation = phrase.replace(/[^a-zA-Z ]+/g, ' ').replace('/ {2,}/',' '),
      tokens = noPunctuation.toLowerCase().split(" "),
      hits   = 0,
      words  = [];

  tokens.forEach(function(t) {
    if (afinn.hasOwnProperty(t)) {
      if (afinn[t] > 0){
        addPush(t, afinn[t]);
      }
    }
  });

  return {
    score : hits,
    comparative : hits / tokens.length,
    words : words
  };
}


// Calculates overall sentiment
// -------------------------------------------------- //

function analyze (phrase) {

  var pos = positivity(phrase),
      neg = negativity(phrase);

  return {
    score       : pos.score - neg.score,
    comparative : pos.comparative - neg.comparative,
    positive    : pos,
    negative    : neg
  };
}


module.exports = {
  analyze    : analyze,
  negativity : negativity,
  positivity : positivity
};
