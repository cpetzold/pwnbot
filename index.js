
/**
 * Module dependencies.
 */

var irc = require('irc')
  , fs = require('fs')
  , opt = require('optimist')
  , ascii = require('asciimo')

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
    , prefix: '!'
  };
}

/**
 * Initialize bot.
 */

var bot = new irc.Client(config.server, config.nickname, {
    channels: config.channels
  , debug: 'development' == env ? true : config.debug
});

/**
 * Include commands
 */

var commands = exports.commands = require('./commands')(bot, config);


config.channels.forEach(function (channel) {

  /**
   * Auto-Pwn all channels the bot is connected to.
   */

  bot.on('join' + channel, function (who) {
    bot.say(channel, who + ': pwned!');
  });

  /**
   * Call command on pm or with action prefix
   */
  
  bot.on('pm', callCommand); 

  bot.on('message' + channel, callCommand);

  function callCommand(from, message) {
    var message = message.trimLeft()
      , regex = new RegExp('^' + config.prefix);

    if (message.search(regex) == -1) {
      return;
    }

    var options = message.slice(config.prefix.length).split(' ')
      , command = options.shift();

    options = opt.parse(options);

    if (commands[command]) {
      commands[command](options);
    } else {
      bot.say(from, '\'' + command + '\' is not a supported command');
    }
  }

});

