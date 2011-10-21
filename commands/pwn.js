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
      //see if a pwn quantity is present
      // example !pwn gullermo|10
      args = username.split('|');
      if(args.length > 1){
        username = args[0];
        var pwnQuantity = args[1];
        var maxPwnage = 28;
        if(pwnQuantity > maxPwnage){
          say('Warning: Pwn limit is ' + maxPwnage);
          pwnQuantity = maxPwnage;
        }
        
        
        var pwnInterval = setInterval(pwnUser, 1000); 
      } else {
        pwnUser();
      }
      
      var pwnCount = 0;
      
      function pwnUser(){
        //check if user is in room
        bot.whois(username, function(info){
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
          pwnCount++;
          if(pwnCount >= pwnQuantity){
            clearInterval(pwnInterval);
          }
      
        });
        
      }
      
    });
  };

};
