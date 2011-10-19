
/**
 * Module dependencies.
 */

var asciimo = require('asciimo')

/**
 * Module exports.
 */

module.exports = ascii;

/**
 * Write utility. Wraps around the dummy async interface.
 *
 * @param {String} text to write in ascii
 * @param {String} font name (`banner`)
 * @api private
 */

function write (text, font, fn) {
  var font = font || 'banner';
  font = font.toLowerCase();
  font = font[0].toUpperCase() + font.slice(1);
  asciimo.Figlet.write(text, font, fn);
}

/**
 * ASCIImo wrapper command.
 */

function ascii (bot) {

  return function ascii (text, say, options, user, channel) {
    write(text, options.font, function(out) {
      if (options.color && ''.irc[options.color]) {
        out = out.split('\n').map(function(s) {
          return s.irc[options.color]();
        }).join('\n');
      }
      say(out);
    });
  };

};
