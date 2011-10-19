
/**
 * Module dependencies.
 */

var request = require('request')
  , timeago = require('timeago');

/**
 * Module exports.
 */

module.exports = locate;

/**
 * define command.
 */

function locate (bot) {
  
  return function locate(text, say, options, user, channel) {
    
    function checkGeo(element, index, array){
      if(element.geo && !message){
        message = 'Last location for @' + username + ': ';

        //reverse geocode lat lng
        request({uri:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + element.geo.coordinates[0] + ',' + element.geo.coordinates[1] + '&sensor=false', json:true}, function (error, response, body) {
          try{
            message += body.results[0].formatted_address;
            message += ' ' + timeago(element.created_at);
            say(message);
          } catch (e) {
            console.error('\033[90m' + e + '\033[39m');
            say('Unable to geocode tweet');
          }
        });
      }
    }
    
    var message = '';
    var username = text.replace('@','').toLowerCase();
    
    request({uri:'http://search.twitter.com/search.json?q=from:' + username + '&rpp=100', json:true}, function (error, response, body) {
      try{
        if(body.results){
          //there is at least one tweet so loop through all tweets and look for the most recent one with geo info
          body.results.forEach(checkGeo);
          
          if(!message){
            say('@' + username + ' doesn\'t have any geolocated tweets');
          }
          
        } else {
          say('@' + username + ' not found');
        }
      } catch (e) {
        console.error('\033[90m' + e + '\033[39m');
        say('Unable to reach Twitter');
      }
      
    });
  }
};
