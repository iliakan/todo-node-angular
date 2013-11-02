var express = require('express');
var http = require('http');
var path = require('path');
var util = require('util');
var config = require('config');
var log = require('lib/log')(module);
var mongoose = require('lib/mongoose');
var HttpError = require('lib/error').HttpError;

var passport = require("lib/passport");

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

app.use(express.favicon());

app.use(express.logger({
  immediate: true,
  format: config.get('log:format')
}));

app.use(express.bodyParser());
app.use(express.cookieParser());

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({mongoose_connection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.methodOverride());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(require('lib/middleware/sendHttpError'));
app.use(require('lib/middleware/templateHelpers'));

require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  next(404);
});

app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }

  if (err.name == 'CastError') {
    // malformed or absent mongoose params
    if (process.env.NODE_ENV == 'development') {
      console.error(err);
    }
    res.sendHttpError(new HttpError(400));
    return;
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    // if error is "call stack too long", then log.error(err) is not verbose
    log.error(err.toString());

    if (process.env.NODE_ENV == 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      res.sendHttpError(new HttpError(500));
    }
  }
});

var server = http.createServer(app);
server.listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

module.exports = app;