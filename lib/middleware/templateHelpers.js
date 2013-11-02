var util = require('util');

function Block(name) {
  this.members = [];
}

Block.prototype.unshift = function(name) {
  if (name instanceof Array) {
    [].unshift.apply(this.members, name);
  } else {
    this.members.unshift(name);
  }
};

Block.prototype.push = function(name) {
  if (name instanceof Array) {
    [].push.apply(this.members, name);
  } else {
    this.members.push(name);
  }
};

function Script() {
  Block.apply(this, arguments);
}
util.inherits(Script, Block);
Script.prototype.toString = function() {
  var result = '';
  this.members.forEach(function(script) {
    result += '<script src="'+script+'"></script>\n';
  });
  return result;
};

function Style() {
  Block.apply(this, arguments);
}
util.inherits(Style, Block);

Style.prototype.toString = function() {
  var result = '';
  this.members.forEach(function(style) {
    result += '<link rel="stylesheet" href="'+style+'">\n';
  });
  return result;
};


module.exports = function(req, res, next) {
  res.locals.script = new Script;
  res.locals.style = new Style;
  next();
};