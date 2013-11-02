var HttpError = require('lib/error').HttpError;
var passport = require('lib/passport');

exports.get = function(req, res) {
  res.render("login");
};

exports.post = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    if (err) return next(err);

    if (!user) {
      return next(new HttpError(403, info.message));
    }

    req.logIn(user, function(err) {
      if (err) return next(err);
      res.send(200);
    });

  })(req, res, next);
};