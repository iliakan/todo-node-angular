var service = angular.module("todoServices", ["ngResource"]);

service.factory("todoManager", function($resource, $http, currentUser) {

  var transformResponseWithDueDate = $http.defaults.transformResponse.concat([
    function transform(response, headersGetter) {

      function convertDueDate(response) {
        if (response.dueDate) response.dueDate = new Date(response.dueDate);
      }

      if (response.forEach) {
        response.forEach(convertDueDate);
      } else {
        convertDueDate(response);
      }

      return response;
    }
  ]);

  return {
    todosByUser: $resource("/api/todos/byUser/:userId",
      {userId: currentUser.id},
      { query: { method: "GET", isArray: true, transformResponse: transformResponseWithDueDate }}
    ),
    todo: $resource("/api/todos/:_id",
      {_id: "@_id"},
      { 'get': { method: 'GET', transformResponse: transformResponseWithDueDate },
        'save': { method: 'POST', transformResponse: transformResponseWithDueDate }
      }
    )
  };
});
