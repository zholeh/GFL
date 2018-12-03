(function() {
  'use strict';

  angular.module("app").controller("UsersController", UsersController);

  function UsersController($scope, $http) {
    this.$scope = $scope;
    this.$http = $http;
    this._init();

    $scope.loaded = false;

    $http({ method: "GET", url: "http://localhost:3005/api/users" }).then(
      function success(response) {
        $scope.users = response.data.res;
        $scope.loaded = true;
      }
    );
  }

  /**
   * initialize the controller
   */
  UsersController.prototype._init = function() {
    this.pageReady = true;
  };

  UsersController.prototype.next = function(isValid) {
    var vm = this;
    vm.selectedIndex += 1;
  };

  UsersController.prototype.prev = function(isValid) {
    var vm = this;
    vm.selectedIndex -= 1;
  };

  UsersController.$inject = ["$scope", "$http"];
})();
