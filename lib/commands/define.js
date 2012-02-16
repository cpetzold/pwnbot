
/**
 * Module dependencies.
 */

var Wordnik = require('wordnik')
  , request = require('request');

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

function truncate(def){
  def = def.replace(/(\r\n|\n|\r)/gm,' ');
  var maxLength = 350;
  if(def.length > maxLength){
    return def.substring(0, maxLength) + '...';
  } else {
    return def;
  }
}


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
    var word = text.trim();
    
    var message = word.irc.bold.silver() + ': ';
    
    //check urban dictionary first
    request({uri:'http://www.urbandictionary.com/iphone/search/define?term=' + encodeURIComponent(word), json:true}, function (error, response, body) {
      
      try{
        
        if(body.result_type == 'no_results'){
          
          //now try wordnik
          wn.definitions(word, function(e, defs) {
            if (e || !defs.length) {
              message += 'No definitions found'.irc.gray();

            } else {
              var n = options.n ? Math.min(options.n, defs.length) : Math.min(defs.length, numRes);

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
            say(message);

          });
        
        } else {
        
          var n = options.n ? Math.min(options.n, body.list.length) : Math.min(body.list.length, numRes);
      
          message += '\n';
          for (var i = 0; i < n; i++) {
            def = body.list[i];
            message += ((i + 1) + '. ').irc.gray();
            message += truncate(def.definition);
            message += (' (UrbanDictionary.com) ');
            message += '\n\t';
            message += ('\u0016Example: ' + truncate(def.example));
            message += '\n';
          }
          say(message);
        } 
      } catch(e) {
        console.error('\033[90m' + e + '\033[39m');
        message += 'Error';
        say(message);
      }

      
    });
  
  };

};
