(function () {
  angular.module('DemS').directive("details", function() {
    return {
      restrict: 'A',
      templateUrl: "partials/details",
      controller: "DetailsController",
      controllerAs: "detailsCtrl",
    };
  });
})();