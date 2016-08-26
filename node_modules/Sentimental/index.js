var analyze = require('./lib/sentimental').analyze,
    negativity = require('./lib/sentimental').negativity,
    positivity = require('./lib/sentimental').positivity;

module.exports = {
  analyze    : analyze,
  negativity : negativity,
  positivity : positivity
};
