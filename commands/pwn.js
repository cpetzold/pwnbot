/**
 * Module exports.
 */

module.exports = pwn;

/**
 * pwn command.
 */

function pwn (bot) {
  
  return function pwn (text, say, options, user, channel) {
    var usernames = text.split(' ');
    usernames.forEach(function(username, index, array){
      //check if user is in room
      bot.whois(username, function pwnUser(info){
        var message = '';
        console.log(info);
      
        if(!info){
          message = username + ' isn\'t on this channel.  Unable to pwn.';
        
        } else {
        
          if(username == user){
            //check that user isn't the same as self
            message = username + ' pwned themselves.';
          
          } else if(username == bot.config.nickname){
            //you can't pwn the pwnbot
            message = 'You can\'t pwn the pwnbot.';
          
          } else {
            //try to pwn the user
            message = info.nick + ' (' + info.realname + ') has been pwned.';
          
          }
       
        }
        say(message);
      
      });
      
    });
  };

};
