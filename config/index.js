var nconf = require('nconf');
var path = require('path');

nconf.argv()
    .env()
    .file('env', path.join(__dirname, 'env', process.env.NODE_ENV + '.json'))
    .file('base', path.join(__dirname, 'config.json'));

module.exports = nconf;
