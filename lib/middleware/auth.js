var HttpError = require('lib/error').HttpError;

exports.mustBeAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return next(403);
  }
};

exports.userIdMustBeCurrentUser = function(req, res, next) {
  if (req.params.userId != req.user.id) {
    next(403);
  } else {
    next();
  }
};

exports.mustBeAnonymous = function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    next();
  }

};