
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
    if (who != config.nickname) {
      bot.say(channel, who + ': pwned!');
    }
  });
});

/**
 * Register commands.
 */

var commands = {}
  , cmdReg = new RegExp('^((' + config.nickname + ':?)? *!([^ ]+) *)', 'i')

fs.readdirSync('./commands').forEach(function (file) {
  var cmd = require('./commands/' + file);
  commands[cmd.name] = cmd(bot);
});

bot.on('message', function (from, to, message) {
  // test for a command
  var match = message.match(cmdReg)
    , cmd = match[3]

  if (commands[cmd]) {
    if (config.debug) {
      console.error('\033[90mgot command - ' + cmd + '\033[39m');
    }

    // get raw message
    var msg = message.replace(match[0], '');

    // parse options
    var options = {}, opt;

    while(opt = msg.match(/([^:]+):((\"([^\"]+)\")|([^ ]+)) */)){
      options[opt[1]] = opt[5] || opt[4];
      msg = msg.replace(opt[0], '');
    }

    commands[cmd](msg, options, function (msg) {
      bot.say(to, msg);
    }, from, to);
  }
});
