(function() {
  "use strict";

  angular.module("app").directive("option", Option);
  angular.module("app").controller("OptionController", OptionController);

  function deepValue(obj, arrField) {
    if (typeof obj != "object") {
      return obj;
    }
    for (var key in obj) {
      if (key === arrField[0]) {
        if (typeof obj[key] === "object") {
          return deepValue(obj[key], arrField.concat().splice(-1, 1));
        } else return obj[key];
      }
    }
    return undefined;
  }

  function Option($compile) {
    return {
      restrict: "E",
      transclude: true,
      replace: true,
      templateUrl: "app/option/option.html",
      link: function(scope, element, attrs, transclude) {
        $compile(element.contents())(scope.$new());
      }
    };
  }

  function OptionController($scope) {
    this.$scope = $scope;
    this.$scope.fields = [
      { name: "name", description: "Name", type: "input" },
      { name: "userId.name", description: "User name", type: "input" },
      { name: "done", description: "Done", type: "checkbox" }
    ];

    this.$scope.filterTasks = function(field) {
      var arrTasks = this.$parent.primaryTasks.concat();
      for (var key in $scope.filters) {
        var arrField = key.split(".");
        arrTasks = arrTasks.filter(function(el) {
          var query = $scope.filters[key];
          var val = deepValue(el, arrField);

          if (!!query && !!val) {
            var reg = new RegExp(query, "ui");
            return val.search(reg) !== -1;
          } else return true;
        });
      }
      this.$parent.tasks = arrTasks;
    };

    this.$scope.sort = function(field, direct) {
      var desc = direct === "desc";
      var arrField = field.split(".");
      this.$parent.tasks = this.$parent.tasks
        .map(function(el) {
          return el;
        })
        .sort(function(a, b) {
          var res;
          var valA = deepValue(a, arrField);
          var valB = deepValue(b, arrField);
          if (desc) res = (valA < valB ? 1 : -1) || 0;
          else res = (valA > valB ? 1 : -1) || 0;
          return res;
        });
    };
  }
})();
