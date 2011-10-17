
/**
 * Module dependencies.
 */

var irc = require('irc')
  , fs = require('fs')

/**
 * Environment.
 */

var env = process.env.NODE_ENV || 'development';
    , debug: true
  });

bot.on('join#pwn', function(who) {
  bot.say('#pwn', who + ': pwned!');
});

