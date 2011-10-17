
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

/**
 * Override debug for dev.
 */

if ('development' == env) {
  config.debug = true;
}

/**
 * Initialize bot.
 */

var bot = new irc.Client(config.server, config.nickname, {
    channels: config.channels
  , debug: config.debug
});

/**
 * Auto-Pwn all channels the bot is connected to.
 */

config.channels.forEach(function (channel) {
  bot.on('join' + channel, function (who) {
    // avoid auto pwning
    if (who != options.nickname) {
      bot.say(channel, who + ': pwned!');
    }
  });
});
