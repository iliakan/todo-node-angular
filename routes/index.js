
var auth = require('lib/middleware/auth');
var mongoose = require('lib/mongoose');

module.exports = function(app) {

  require('./todo')(app);

  app.get("/", require('./frontpage').get);

  app.get("/login", auth.mustBeAnonymous, require('./login').get);

  app.post("/login", require('./login').post);

  app.get("/signup", auth.mustBeAnonymous, require('./signup').get);
  app.post("/signup", require('./signup').post);

  app.post('/logout', require('./logout').post);
};