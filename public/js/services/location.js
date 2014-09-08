(function () {
    angular.module('DemS').factory("Location", function($resource) {
      return $resource('/api/patient/:id/locations');
    });
})();