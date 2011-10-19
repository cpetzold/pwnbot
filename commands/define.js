
/**
 * Module dependencies.
 */

var Wordnik = require('wordnik')

/**
 * Module exports.
 */

module.exports = define;

/**
 * Default number of results
 */

var numRes = 3;

/**
 * define command.
 */

function define (bot) {
  
  var key = bot.config.wordnik_key
    , wn = key ? new Wordnik({ api_key: key }) : null;

  return function define (text, say, options, user, channel) {
    if (!wn) { 
      return;
    }

    wn.definitions(text, function(e, defs) {
      var message = ''
        , n = options.n ? Math.min(options.n, defs.length) : Math.min(defs.length, numRes);
  
      for (var i = 0; i < n; i++) {
        def = defs[i];
        message += ((i + 1) + '. ').irc.gray();
        message += def.partOfSpeech.irc.green() + ' - '.irc.gray();
        message += def.text.irc.cyan() + '\n';
      }
  
      say(message);
    });
  };

};
