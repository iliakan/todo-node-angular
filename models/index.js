var fs = require('fs');

var files = fs.readdirSync(__dirname);
files.forEach(function(file) {
  require('./' + file);
});