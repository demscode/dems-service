(function () {
    angular.module('DemS').factory("Patient", function($resource) {
      return $resource('/api/patient/:id');
    });
})();