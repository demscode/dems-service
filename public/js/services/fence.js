(function () {
  angular.module('DemS').factory("Fence", function($resource) {
    return $resource('/api/patient/:id/fence/:fid', {}, {
      update: {
        method: 'PUT'
      }
    });
  });
})();