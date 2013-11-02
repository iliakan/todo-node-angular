var passport = require("passport");
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var User = require('models/user').User;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    if (!email) return done(null, false, { message: 'Please provide email.' });
    if (!password) return done(null, false, { message: 'Please provide password.' });

    User.findOne({email: email}, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Non-registered email.' });

      if (user.checkPassword(password)) {
        return done(null, user);
      } else {
        done(null, false, {
          message: 'Incorrect password.'
        });
      }
    });
  }
));



module.exports = passport;
