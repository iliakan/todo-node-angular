var data = require('test/data');
var User = require('models/user').User;
var async = require('async');

describe('User', function() {
  before(function(done) {
    data.createEmptyDb(done)
  });

  it('errors on save for bad email', function(done) {

    var user = new User({
      email: "BAD",
      password: "123"
    });

    user.save(function(err) {
      err.name.should.equal('ValidationError');
      err.errors.email.value.should.equal(user.get('email'));
      done();
    });

  });

  it('errors on save without password', function(done) {

    var user = new User({
      email: "BAD"
    });

    user.save(function(err) {
      done(err ? undefined : new Error("Password must be set"));
    });

  });

  it('autogenerates salt and hash', function(done) {

    var user = new User({
      email: "a@b.ru",
      password: "pass"
    });

    user.get('salt').should.not.be.empty;
    user.get('hash').should.not.be.empty;
    user.checkPassword("pass").should.be.true;
    done();

  });

  it('requires unique email', function(done) {

    function create(callback) {
      new User({
        email: "nonunique@b.ru",
        password: "pass"
      }).save(callback);
    }

    async.series([
      create,
      create
    ], function(err) {
      if (!err) return done(new Error("Same email is saved twice!"));
      err.code.should.equal(11000); // unique index is checked by mongo
      done();
    });

  });

});
