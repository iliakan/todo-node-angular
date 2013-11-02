
exports.post =  function(req, res) {
  req.logout();
  res.redirect('/');
};