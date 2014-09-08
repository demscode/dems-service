(function () {
  angular.module('DemS').directive("locations", function() {
    return {
      restrict: 'A',
      templateUrl: "partials/locations",
      controller: "LocationsController",
      controllerAs: "locationsCtrl",
    };
  });
})();