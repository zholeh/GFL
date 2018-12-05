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
    this.$scope.filters = [
      { value: "", name: "name", description: "Name", type: "input" },
      {
        value: "",
        name: "userId.name",
        description: "User name",
        type: "input"
      },
      {
        value: false,
        name: "done",
        description: "Done",
        type: "checkbox",
        enabled: false
      },
      {
        value: 0,
        name: "importance",
        description: "Importance",
        type: "slider",
        enabled: false,
        min: 0,
        max: 10
      }
    ];

    this.$scope.filterTasks = function(event) {
      var arrTasks = this.$parent.primaryTasks.concat();
      for (var key in $scope.filters) {
        var field = $scope.filters[key];
        var query = field.value;
        if (typeof field.value === "string") {
          query = query.trim();
          if (query === "") {
            continue;
          }
        } else if (typeof query === "boolean" || typeof query === "number") {
          if (!field.enabled) {
            continue;
          }
        }
        var arrField = field.name.split(".");
        arrTasks = arrTasks.filter(function(el) {
          var val = deepValue(el, arrField);
          if (typeof query === "boolean" || typeof query === "number") {
            return query === val;
          } else {
            var reg = new RegExp(query, "i");
            return (typeof val === 'string') ? val.search(reg) !== -1 : false;
          }
        });
      }
      $scope.tasks = arrTasks.concat();
    };

    this.$scope.sort = function(field, direct) {
      var desc = direct === "desc";
      var arrField = field.split(".");
      this.$parent.tasks = this.$parent.tasks.concat().sort(function(a, b) {
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
