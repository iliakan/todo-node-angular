
var todo = angular.module('todo', ['todoServices', 'ui.date', 'ui.bootstrap', 'ngAnimate']);

todo.controller('TodoCtrl', function($scope, $window, $rootScope, $document, todoManager, $modal) {

  $document.on('click', 'a[href="#"]', function(e) {
    e.preventDefault();
  });

  $rootScope.$on('httpError', function(event, response) {
    $window.alert("Sorry, the operation has failed.\nServer returned error " + response.status +".\nOur programmers were informed about this.");
  });


  $scope.todos = todoManager.todosByUser.query();

  $scope.getSortClass = function(field) {
    if ($scope.sortField == field) return 'sortDown';
    var reversedField = (field[0] == "-") ? field.slice(1) : "-" + field;
    if ($scope.sortField == reversedField) return 'sortUp';
  };

  $scope.sortField = "";
  $scope.setSortField = function(field) {
    var reversedField = (field[0] == "-") ? field.slice(1) : "-" + field;
    if ($scope.sortField == field) {
      $scope.sortField = reversedField;
    } else if ($scope.sortField == reversedField) {
      $scope.sortField = "";
    } else {
      $scope.sortField = field;
    }
  };


  $scope.todos = todoManager.todosByUser.query();

  $scope.onDoneClick = function(todo) {
    todo.done = !todo.done;
    todoManager.todo.save(todo);
  };

  $scope.onDeleteClick = function(todo) {
    if (!confirm("Delete, really?")) return;

    $scope.todos.splice($scope.todos.indexOf(todo), 1);
    // pass only _id to .delete, otherwise it would send the whole object on server
    todoManager.todo.delete({_id: todo._id});
  };

  $scope.onEditClick = function(todo, field) {
    $scope.editing = {
      todo: todo,
      field: field,
      value: angular.copy(todo[field]),
      dateOptions: {
        onClose: function(dateStr) {
          $scope.$apply(function() {
            if (dateStr) {
              $scope.editing.todo.dueDate = $.datepicker.parseDate("mm/dd/yy", dateStr);
              todoManager.todo.save($scope.editing.todo);
            }
            $scope.editing = null;
          });
        }
      }
    };
  };


  $scope.onEditFormSubmit = function(form) {
    if (form.$invalid) {
      $scope.editing = null;
      return;
    }

    $scope.editing.todo[$scope.editing.field] = $scope.editing.value;
    todoManager.todo.save($scope.editing.todo);
    $scope.editing = null;
  };

  $scope.onAddClick = function() {
    var modalInstance = $modal.open({
      templateUrl: 'todoAddForm.html',
      controller: ModalInstanceCtrl
    });

    function ModalInstanceCtrl($scope, $modalInstance) {

      $scope.todo = {
        priority: 0,
        dueDate: new Date(),
        text: "",
        done: false
      };

      $scope.ok = function(form) {
        if (form.$invalid) return false;
        $modalInstance.close($scope.todo);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }

    modalInstance.result.then(function (todo) {
      todoManager.todo.save(todo, function(todo) {
        $scope.todos.push(todo);
      });
    });

  };


});
