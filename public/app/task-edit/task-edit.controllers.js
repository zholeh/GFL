(function() {
  "use strict";

  angular.module("app").controller("TaskEditController", TaskEditController);

  function TaskEditController($location, $http, $scope) {
    this.$location = $location;
    this.$http = $http;
    this.$scope = $scope;

    $scope.user = {};
    this._init();

    $scope.hideTaskEditor = function() {
      $mdDialog.hide();
    };

    $scope.cancelTaskEditor = function() {
      $mdDialog.cancel();
    };
  }

  TaskEditController.prototype._init = function() {
    this.pageReady = true;
  };

  TaskEditController.$inject = ["$location", "$http", "$scope"];
})();
