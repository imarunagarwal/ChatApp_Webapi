require('colors');
var _ = require('lodash');

var config = require('../config/config');

var noOperation = function(){};

var consoleLog = config.logging ? console.log.bind(console) : noOperation;

var logger = {
  log: function() {
    var tag = '[ ✨ LOG ✨ ]'.green;
    var args = _.toArray(arguments)
      .map(function(arg) {
        if(typeof arg === 'object') {
          // turn the object to a string so we
          // can log all the properties and color it
          var string = JSON.stringify(arg, null, 2);
          if (string) {
            return tag + '  ' + string.cyan;
          }
          return tag;
        } else {
          return tag + '  ' + arg.cyan;
        }
      });

    consoleLog.apply(console, args);
  },

  error: function() {
    var args = _.toArray(arguments)
      .map(function(arg) {
        arg = arg.stack || arg;
        var name = arg.name || '[ ❌ ERROR ❌ ]';
        var log = name.yellow + '  ' + arg.red;
        return log;
      });

    consoleLog.apply(console, args);
  }
};

module.exports = logger;
