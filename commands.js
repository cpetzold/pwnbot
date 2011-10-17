/**
 * Bot commands
 * Ex: '!say hello world' -> 'pwnbot: hello world'
 */

module.exports = function(bot, config) {
  return {

    ascii: function(opts) {
      console.log(opts);
    }

  };
};
