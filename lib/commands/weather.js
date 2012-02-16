
/**
 * Module dependencies.
 */

var request = require('request')
  , xml2js = require('xml2js');

/**
 * Module exports.
 */

module.exports = weather;

/**
 * define command.
 */

function weather (bot) {
  
  return function weather(text, say, options, user, channel) {
    
    request({uri:'http://www.google.com/ig/api?weather=' + text.replace(' ', '+')}, function (error, response, body) {
      // Result is XML
      try{
        var parser = new xml2js.Parser();
        parser.parseString(body, function (err, result) {
          var message = 'Weather for ' + result.weather.forecast_information.city['@'].data + ':\n';
          message += 'Current Conditions: ' + result.weather.current_conditions.temp_f['@'].data + '\u00B0F ' + result.weather.current_conditions.condition['@'].data;
          message += ', ' + result.weather.current_conditions.humidity['@'].data + ', ' +  result.weather.current_conditions.wind_condition['@'].data + '\n';
          result.weather.forecast_conditions.forEach(function(element, index, array){
            message += element.day_of_week['@'].data + ': ' +  element.low['@'].data + ' - ' +  element.high['@'].data + '\u00B0F, ' + element.condition['@'].data + '\n';
          });
          say(message);
        });
        

      } catch(e) {
        console.error('\033[90m' + e + '\033[39m');
        say('Unable to retreive weather from Google for ' + text);
      }
      
    });
  }
};
