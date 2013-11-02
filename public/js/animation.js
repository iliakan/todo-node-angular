angular.module('todo').animation('.focus-on-show', function() {
  return {
    enter: function(element, done) {
      $(element).find('input').focus();
      done();
    },

    leave: function(element, done) {
      done();
    }
  };
});
