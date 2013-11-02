// similar to debug module
// module path is taken from the project root (where package.json resides)
// DEBUG=-models/ok,models/* node app  => will set logLevel=debug for models/* except ok

var winston = require('winston');
var path = require('path');
var fs = require('fs');

var names = [], skips = [];

(process.env.DEBUG || '')
    .split(/[\s,]+/)
    .forEach(function(name) {
      name = name.replace('*', '.*?');
      if (name[0] === '-') {
        skips.push(new RegExp('^' + name.substr(1) + '$'));
      } else {
        names.push(new RegExp('^' + name + '$'));
      }
    });

function findProjectRoot() {

  var dir = __dirname;
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    dir = path.dirname(dir);
  }

  return path.normalize(dir);
}

var projectRoot = findProjectRoot();

function getLogLevel(module) {

  var modulePath = module.filename.slice(projectRoot.length + 1); // models/user.js
  modulePath = modulePath.replace(/\.js$/, '');

  var logLevel = 'info';

  var isSkipped = skips.some(function(re) {
    return re.test(modulePath);
  });

  if (!isSkipped) {
    var isIncluded = names.some(function(re) {
      return re.test(modulePath);
    });

    if (isIncluded) logLevel = 'debug';
  }

  return logLevel;
}

function getLogger(module) {

  var showPath = module.filename.split('/').slice(-2).join('/');

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: getLogLevel(module),
        label: showPath
      })
    ]
  });
}

module.exports = getLogger;