(function() {
  "use strict";

  angular.module("app").controller("HomeController", HomeController);

  var deepCopy = function(obj) {
    if (typeof obj != "object") {
      return obj;
    }
    var copy = obj.constructor();
    for (var key in obj) {
      if (typeof obj[key] == "object") {
        copy[key] = deepCopy(obj[key]);
      } else {
        copy[key] = obj[key];
      }
    }
    return copy;
  };

  function HomeController($location, $http, $scope, $mdDialog, $controller) {
    this.$location = $location;
    this.$http = $http;
    this.$scope = $scope;

    $scope.users = [];
    $scope.newUser = "";

    this.loadUsers();
    this.loadTasks();
    this._init();

    $scope.showTaskEditor = function(event, task) {
      $mdDialog
        .show({
          controller: TaskEditController,
          locals: {
            task: task,
            users: $scope.users,
            tasks: $scope.tasks
          },
          templateUrl: "/app/home/task-edit.html",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true
        })
        .then(
          function(res) {},
          function() {} // nothing to do
        );
    };

    $scope.deleteTask = function(event, task) {
      $http({
        method: "DELETE",
        url: "http://localhost:3005/api/tasks?id=" + task._id
      }).then(function success(res) {
        if ("" + res.status === "200" && (res.data.message = "OK")) {
          var index;
          var arr = $scope.tasks;
          for (var i = 0; i < $scope.tasks.length; i++) {
            if ($scope.tasks[i]._id === res.data.res) {
              index = i;
              break;
            }
          }

          if (index !== undefined) {
            $scope.tasks.splice(index, 1);
          }
        }
      });
    };

    $scope.handleAddNewUser = function(newUser, event) {
      if (newUser.length > 0 && (event === undefined || event.keyCode === 13)) {
        var self = this;
        $scope.newUser = "";
        $http({
          method: "POST",
          url: "http://localhost:3005/api/users",
          data: { name: newUser }
        }).then(function success(response) {
          self.homeCtrl.loadUsers();
        });
      }
    };

    $scope.handleClick = function(user) {
      var self = this;
      $http({
        method: "DELETE",
        url: "http://localhost:3005/api/users?id=" + user._id
      }).then(function success(response) {
        self.homeCtrl.loadUsers();
      });
    };
  }

  HomeController.prototype.loadUsers = function() {
    var self = this;
    self
      .$http({ method: "GET", url: "http://localhost:3005/api/users" })
      .then(function success(response) {
        self.$scope.users = response.data.res;
        self.$scope.usersLoaded = true;
      });
  };

  HomeController.prototype.loadTasks = function() {
    var self = this;
    self
      .$http({ method: "GET", url: "http://localhost:3005/api/tasks" })
      .then(function success(response) {
        self.$scope.tasks = response.data.res;
        self.$scope.tasksLoaded = true;
      });
  };

  HomeController.prototype._init = function() {
    this.pageReady = true;
  };

  HomeController.$inject = [
    "$location",
    "$http",
    "$scope",
    "$mdDialog",
    "$controller"
  ];

  function TaskEditController($scope, $mdDialog, task, users, tasks) {
    $scope.task = deepCopy(task);
    $scope.tasks = tasks;
    $scope.users = users;
    $scope.searchText = "";

    $scope.filterUsersByName = function(queryName) {
      if (!queryName) return $scope.users;
      else
        return $scope.users.filter(function(el) {
          var reg = new RegExp(queryName, "ui");
          return el.name.search(reg) !== -1;
        });
    };
    $scope.cancelTaskEditor = function(res) {
      if (!!res) {
        var newTask = deepCopy(res);
        $http({
          method: "PUT",
          url: "http://localhost:3005/api/tasks?id=" + newTask._id,
          data: newTask
        }).then(function success(res) {
          if ("" + res.status === "200" && (res.data.message = "OK")) {
            var index;
            var arr = $scope.tasks;
            for (var i = 0; i < $scope.tasks.length; i++) {
              if ($scope.tasks[i]._id === res.data.res._id) {
                index = i;
                break;
              }
            }

            if (index !== undefined) {
              $scope.tasks.splice(index, 1, res.data.res);
            }
          }
        });
        $mdDialog.hide(res, $scope);
      } else $mdDialog.cancel();
    };
    $scope.selectedItemChange = function() {};
    $scope.searchTextChange = function() {};
  }
})();
