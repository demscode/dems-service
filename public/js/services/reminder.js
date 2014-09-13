(function () {
    angular.module('DemS').factory("Reminder", function($resource) {
      return $resource('/api/patient/:id/reminder', {}, {
        getPatientsReminders: {method:'GET', isArray:true},
        update: {method:'PUT', url:'/api/patient/:id/reminder/:reminderId'},
        delete: {method:'DELETE', url:'/api/patient/:id/reminder/:reminderId'},
      });
    });
})();