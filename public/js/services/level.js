(function () {
    angular.module('DemS').factory("Level", function($resource) {
      return $resource('/api/level/:id/', {}, {
        getAllLevels: {url: '/api/allLevels', method:'GET', isArray:true}
      });
    });
})();