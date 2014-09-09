(function () {
    angular.module('DemS').factory("Patient", function($resource) {
      return $resource('/api/patient/:id', {}, {
        getCarersPatients: {method:'GET', url:'api/carersPatients', isArray:true},
      });
    });
})();