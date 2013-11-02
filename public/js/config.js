
angular.module('todo').config(function($httpProvider) {

  $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      'responseError': function(responseError) {
        $rootScope.$broadcast('httpError', responseError);
        return $q.reject(responseError);
      }
    };
  });
});
