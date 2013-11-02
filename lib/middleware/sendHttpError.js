module.exports = function(req, res, next) {

  res.sendHttpError = function(error) {

    res.status(error.status);

    var preferredType = res.req.accepts('html, json');
    if (preferredType == 'json') {
      res.json(error);
    } else {
      res.render("error", {error: error});
    }
  };

  next();

};