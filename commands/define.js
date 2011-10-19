
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
 * Dictionary source mapping
 */

var dictionaries = {
    ahd: 'American Heritage Dictionary'
  , century: 'Century Dictionary'
  , wiktionary: 'Wiktionary'
  , webster: 'Webster\'s Dictionary'
  , wordnet: 'WordNet'
};
dictionaries['ahd-legacy'] = dictionaries.ahd;

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
    var words = text.trim().split(' ');
    console.log(words);

    words.forEach(function(word) {
      wn.definitions(word, function(e, defs) {
        var message = word.irc.bold.silver() + ': '
          , n = options.n ? Math.min(options.n, defs.length) : Math.min(defs.length, numRes);
  
        console.log(e, defs);

        if (e || !defs.length) {
          message += 'No definitions found'.irc.gray();
        } else {
          message += '\n';
          for (var i = 0; i < n; i++) {
            def = defs[i];
            message += ((i + 1) + '. ').irc.gray();
            message += def.partOfSpeech.irc.green() + ' - '.irc.gray();
            message += def.text.irc.cyan();
            message += (' (' + dictionaries[def.sourceDictionary] + ')').irc.gray();
            message += '\n';
          }
        }

        console.log(message);
    
        say(message);
      });
    });
  };

};
