(function() {
  "use strict";

  angular.module("app").directive("taskList", taskLists);

  function taskLists($compile) {
    return {
      restrict: "E",
      transclude: true,
      replace: true,
      templateUrl: "app/task-list/task-list.html",
      link: function(scope, element, attrs) {
        $compile(element.contents())(scope.$new());
      }
    };
  }
})();
