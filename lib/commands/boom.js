/**
 * Module exports.
 */

module.exports = boom;

/**
 * boom command.
 */

function boom (bot) {
  
  return function boom (text, say, options, user, channel) {
    
    var boom = this.boom
    var message = 'BOOM!'.irc.red();
    
    if(boom.boomOn){
      say('Error:'.irc.red() + ' Boom queue full.'.irc.gray());
    } else {
      boom.boomOn = true;
      setTimeout(doBoom, (Math.random()*30000 + 2000));

      function doBoom(){
        boom.boomOn = false;
        say(message);
      }
    }
  };

};
