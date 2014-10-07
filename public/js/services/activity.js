(function () {
    angular.module('DemS').factory("Activity", function($resource) {
      return $resource('/api/patient/:id/activity', {}, {
        getPatientsActivities: {method:'GET', isArray:true}
      });
    });
})();