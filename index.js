
/**
 * Module dependencies.
 */

var irc = require('irc')
  , fs = require('fs')
  , c = require('irc-colors').global()

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
 * Override debug for dev.
 */

if ('development' == env) {
  config.debug = true;
}

/**
 * Don't crash on uncaught exception
 */
process.on('uncaughtException', function(e) {
  console.error('Exception %s: %s', e.type, e.stack || e.message);
});

/**
 * Initialize bot.
 */

var bot = new irc.Client(config.server, config.nickname, {
    channels: config.channels
  , debug: config.debug
});
bot.config = config;

/**
 * Register commands.
 */

var commands = {}
  , cmdReg = new RegExp('^((' + config.nickname + ':?)? *!([^ ]+) *)', 'i')

fs.readdirSync('./commands').forEach(function (file) {
  if (file.search(/js$/) != -1) {
    var cmd = require('./commands/' + file);
    commands[cmd.name] = cmd(bot);
  }
});

bot.on('message', function (from, to, message) {
  // test for a command
  var match = message.match(cmdReg)
  if (!match) {
    return;
  }
  
  var cmd = match[3]

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

    commands[cmd](msg, function (msg) {
      bot.say(to, msg);
    }, options, from, to);
  }
});
