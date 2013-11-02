var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

require('models');

module.exports = mongoose;
