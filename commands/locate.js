
/**
 * Module dependencies.
 */

var request = require('request')
  , timeago = require('timeago');

/**
 * Module exports.
 */

module.exports = locate;

function checkGeo(element, index, array){
  if(element.geo && !message){
    
    message = 'Last location for @' + text + ': ';
    
    //reverse geocode lat lng
    request({uri:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + element.geo.coordinates[0] + ',' + element.geo.coordinates[1] + '&sensor=false'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var location = JSON.parse(body);
        
        message += location.results[0].formatted_address;
        message += ' ' + timeago(element.created_at);
        
        say(message);
      }
    });
  }
}

/**
 * define command.
 */

function locate (bot) {
  
  return function locate(text, say, options, user, channel) {
    var message = '';
    
    request({uri:'http://search.twitter.com/search.json?q=from:' + text + '&rpp=100'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var tweets = JSON.parse(body);
        
        if(tweets.results){
          //there is at least one tweet so loop through all tweets and look for the most recent one with geo info
          tweets.results.forEach(checkGeo);
          
          if(!message){
            say(text + ' doesn\'t have any geolocated tweets');
          }
          
        } else {
           
          say(text + ' not found');
        }
      } else {
        say('Twitter Error');
      }
    
    });
  }
};
