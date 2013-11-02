var HttpError = require('lib/error').HttpError;
var User = require('models/user').User;

exports.get = function(req, res) {
  res.render("signup");
};

exports.post = function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return next(new HttpError(403, "Enter email and password please."));
  }

  User.signup(req.body.email, req.body.password, function(err, user) {
    if (err) {
      if (err.name == 'ValidationError') {
        return next(new HttpError(403, err.errors.email.type));
      }

      if (err.name == 'MongoError' && err.code == 11000) {
        return next(new HttpError(403, "This email is registered already."));
      }
    }

    req.login(user, function(err) {
      console.log(err);

      if (err) return next(err);
      return res.redirect("/");
    });
  });
};