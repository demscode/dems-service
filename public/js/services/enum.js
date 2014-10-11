(function () {
    angular.module('DemS').factory("Enum", function($resource) {
      return $resource('/api/enum/:enumName', {}, {
        get: {method:'GET'}
      });
    });
})();