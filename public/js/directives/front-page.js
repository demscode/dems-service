(function () {
  angular.module('DemS').directive("frontPage", function() {
    return {
      restrict: 'E',
      templateUrl: "partials/front-page"
    };
  });
})();