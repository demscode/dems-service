(function() {
	var carerServices = angular.module('DemS.services', ['ngResource']);

	carerServices.factory('Carer', ['$resource', function($resource){
    return $resource('api/currentCarer', {}, {
      query: {method:'GET', isArray:false}
    });
  }]);

})();