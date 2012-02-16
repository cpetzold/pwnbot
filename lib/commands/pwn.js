/**
 * Module exports.
 */

module.exports = pwn;

/**
 * pwn command.
 */

function pwn (bot) {
  
  return function pwn (text, say, options, user, channel) {
    var usernames = [];
    if(text){
      usernames = text.split(' ');
    } else if(options){
  
      for(var i in options){
        usernames.push(i);
      }
      
    }
    
    usernames.forEach(function(username, index, array){
      //see if a pwn quantity is present
      // example !pwn gullermo:10
      if(options[username] > 1){
        var pwnQuantity = options[username];
        var maxPwnage = 28;
        if(pwnQuantity > maxPwnage){
          say('Warning: Pwn limit is ' + maxPwnage);
          pwnQuantity = maxPwnage;
        }
        
        var pwnInterval;
        //make sure user exists before trying to pwn
        bot.whois(username, function(info, err){
          if(err || !info){
              message = username + ' isn\'t on this channel.  Unable to pwn.';
          } else {
            pwnInterval = setInterval(pwnUser, 1000);
          }
        });
        
        
      } else {
        pwnUser();
      }
      
      var pwnCount = 0;
      
      function pwnUser(){
        //check if user is in room
        var message = '';
        
        try{
          bot.whois(username, function(info, err){
          
            if(err || !info){
                message = username + ' isn\'t on this channel.  Unable to pwn.';

            } else {

              if(username == user){
                //check that user isn't the same as self
                message = username + ' ' + 'pwned'.irc.red() + ' themselves.';

              } else if(username == bot.config.nickname){
                //you can't pwn the pwnbot
                message = 'You can\'t pwn the pwnbot.';

              } else {
                //try to pwn the user
                message = info.nick + ' (' + info.realname.irc.gray() + ') has been ' + 'pwned'.irc.red() + '.';

              }

            }
          
            say(message);
            pwnCount++;
            if(pwnCount >= pwnQuantity){
              clearInterval(pwnInterval);
            }
      
          });
        } catch(e) {
          message = username + ' isn\'t on this channel.  Unable to pwn.';
          say(message);
          clearInterval(pwnInterval);
        }
        
      }
      
    });
  };

};
