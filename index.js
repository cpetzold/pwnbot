
/**
 * Module dependencies.
 */

var irc = require('irc')
  , fs = require('fs')

/**
 * Environment.
 */

var env = process.env.NODE_ENV || 'development';

/**
 * Load up configuration.
 */

var config;

try {
  config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));
} catch (e) {
  console.error('\033[90mconfig.json unparseable - ignoring\033[39m');
  config = {
      server: 'irc.the0th.com'
    , nickname: 'pwnbot'
    , channels: ['#pwn']
    , debug: true
  };
}

bot.on('join#pwn', function(who) {
  bot.say('#pwn', who + ': pwned!');
});

