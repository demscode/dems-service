(function () {
  angular.module('DemS').directive("activities", function() {
    return {
      restrict: 'A',
      templateUrl: "partials/activities",
      controller: "ActivitiesController",
    };
  });
})();