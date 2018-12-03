(function() {
  "use strict";
  angular
    .module("app", ["ngRoute", "ngAnimate", "ngMaterial"])
    .config(config)
    .run(run);

  config.$inject = ["$routeProvider", "$locationProvider"];

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "app/home/home.html",
        controller: "HomeController",
        controllerAs: "homeCtrl"
      })
      .when("/users", {
        templateUrl: "app/users/users.html",
        controller: "UsersController",
        controllerAs: "usersCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });

    $locationProvider.html5Mode(true);
  }

  function run() {}
})();
