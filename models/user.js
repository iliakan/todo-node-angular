var mongoose = require('mongoose');
var hash = require('lib/hash');

var schema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  salt: String,
  hash: String
});

schema.methods.toPublicObject = function() {
  return {
    email: this.get('email'),
    id: this.id
  };
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = hash.createSalt();
    this.hash = hash.createHash(password, this.salt);
  })
  .get(function() {
    return this._plainPassword;
  });


schema.statics.signup = function(email, password, done) {
  var User = this;

  User.create({
    email: email,
    password: password
  }, done);

};

schema.methods.checkPassword = function(password) {
  return hash.createHash(password, this.salt) == this.hash;
};

schema.path('email').validate(function(value) {
  // wrap in new RegExp instead of /.../, to evade WebStorm validation errors (buggy webstorm)
  return new RegExp('^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,5}$').test(value);
}, 'Please provide the correct e-mail.');

exports.User = mongoose.model('User', schema);
exports.schema = schema;
