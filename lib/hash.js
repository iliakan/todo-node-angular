var crypto = require('crypto');

var LEN = 128;

/**
 * Iterations. ~300ms
 */
var ITERATIONS = 12000;

exports.createHash = function(password, salt) {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, LEN);
};

exports.createSalt = function() {
  return crypto.randomBytes(LEN).toString('base64');
};
