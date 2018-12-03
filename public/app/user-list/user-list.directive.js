(function() {
  "use strict";

  angular.module("app").directive("userList", userLists);

  function userLists($compile) {
    return {
      restrict: "E",
      transclude: true,
      // scope: { value: '=', onEdit: '&' },
      replace: true,
      templateUrl: "app/user-list/user-list.html",
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope.$new());
      }
    };
  }
})();
