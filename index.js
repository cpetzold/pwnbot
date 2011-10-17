
/**
 * Module dependencies.
 */

var irc = require('irc')
  , bot = new irc.Client('irc.the0th.com', 'pwnbot', {
      channels: ['#pwn']
    , debug: true
  });

bot.on('join#pwn', function(who) {
  bot.say('#pwn', who + ': pwned!');
});

