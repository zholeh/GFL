(function() {
  "use strict";

  angular.module("app").controller("HomeController", HomeController);

  function HomeController($location, $http, $scope, $mdDialog, $controller) {
    this.$location = $location;
    this.$http = $http;
    this.$scope = $scope;

    $scope.users = [];
    $scope.newUser = "";

    function TaskEditController($scope, $mdDialog, task, users) {
      $scope.task = task;
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
      $scope.cancelTaskEditor = function() {
        $mdDialog.cancel();
      };
      $scope.selectedItemChange = function() {};
      $scope.searchTextChange = function() {};
    }

    this.loadUsers();
    this.loadTasks();

    $scope.showTaskEditor = function(event, task) {
      $mdDialog
        .show({
          controller: TaskEditController,
          locals: {
            task: task,
            users: $scope.users
          },
          templateUrl: "/app/home/task-edit.html",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true
        })
        .then(
          function(res) {
            $scope.status = 'You said the information was "' + res + '".';
          },
          function() {
            $scope.status = "You cancelled the dialog.";
          }
        );
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

    this._init();
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

  HomeController.prototype.redirectTo = function(to) {
    this.$location.path(to);
  };

  HomeController.prototype._init = function() {
    this.pageReady = true;
  };

  HomeController.prototype.next = function(isValid) {
    var vm = this;
    vm.selectedIndex += 1;
  };

  HomeController.prototype.prev = function(isValid) {
    var vm = this;
    vm.selectedIndex -= 1;
  };

  HomeController.$inject = [
    "$location",
    "$http",
    "$scope",
    "$mdDialog",
    "$controller"
  ];
})();
