exports.Bot = require('./lib/bot');

exports.createBot = function(config) {
  return new exports.Bot(config);
};