
/**
 * Module dependencies.
 */

var request = require('request');

/**
 * Module exports.
 */

module.exports = stock;

/**
 * define command.
 */

function stock (bot) {
  
  return function stock(text, say, options, user, channel) {
    var symbol = text.toUpperCase();
    
    request({uri:'http://download.finance.yahoo.com/d/quotes.csv?s=' + symbol + '&f=ll'}, function (error, response, body) {
      // Result is a small CSV file like:
      // "Oct 18 - <b>590.51</b>","Oct 18 - <b>590.51</b>"
      try{
        var results = body.replace(/"/g, '').split(',');
        var prices = results[0].replace(/<.*?>/g, '').split('-');
        
        if(prices[1].trim() != '0.00'){
          say('Price for ' + symbol + ' on ' + prices[0].trim() + ': $' + prices[1].trim());
        } else {
          say('Invalid Symbol ' + symbol);
        }
      } catch(e) {
        console.error('\033[90m' + e + '\033[39m');
        say('Unable to retreive prices from Yahoo');
      }
      
    });
  }
};
