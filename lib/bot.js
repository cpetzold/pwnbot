/**
 * Module dependencies.
 */

var fs = require('fs')
  , irc = require('irc')
  , log = require('logule')
  , c = require('irc-colors').global()

var Bot = module.exports = function(config) {
  this.config = config;
  this.cmdReg = this.config.cmdReg || new RegExp('^((' + config.nickname + ':?)? *!([^ ]+) *)', 'i');
  
  this.config.autoConnect = false;
  this.client = new irc.Client(this.config.server, this.config.nickname, this.config);
  
  this.commands = this._initCommands();
  this._debug('Commands initialized');
  
  this.client.on('message', this._onMessage.bind(this));
};

Bot.prototype.connect = function(retryCount, fn) {
  var self = this;
  this.client.connect(retryCount, function() {
    self._debug('Connected');
    fn();
  });
};

Bot.prototype.say = function() {
  this.client.say.apply(this.client, arguments);
};

Bot.prototype._onMessage = function(from, to, message) {
  var self = this
    , match = message.match(this.cmdReg)
    
  if (!match) {
    return;
  }
  
  var cmd = match[3]

  if (this.commands[cmd]) {
    this._debug('Got command:', cmd);

    // get raw message
    var msg = message.replace(match[0], '');

    // parse options
    var options = {}, opt;

    while(opt = msg.match(/([^:]+):((\"([^\"]+)\")|([^ ]+)) */)){
      options[opt[1]] = opt[5] || opt[4];
      msg = msg.replace(opt[0], '');
    }

    this.commands[cmd](msg, function (msg) {
      self.client.say(to, msg);
    }, options, from, to);
  }
};

Bot.prototype._initCommands = function() {
  var self = this
    , commands = {};
  fs.readdirSync(__dirname + '/commands').forEach(function (file) {
    if (file.search(/js$/) != -1) {
      var cmd = require(__dirname + '/commands/' + file);
      commands[cmd.name] = cmd(self);
    }
  });
  return commands;
};

Bot.prototype._debug = function() {
  if (this.config.debug) {
    log.debug.apply(this, arguments);
  }
};
