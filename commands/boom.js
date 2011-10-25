/**
 * Module exports.
 */

module.exports = boom;

/**
 * boom command.
 */

function boom (bot) {
  
  return function boom (text, say, options, user, channel) {
    var message = 'BOOM!'.irc.red();
    
    setTimeout(boom, (Math.random()*30000 + 2000));
    
    function boom(){
      say(message);
    }
  };

};
