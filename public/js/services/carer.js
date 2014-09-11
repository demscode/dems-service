(function () {
  angular.module('DemS').factory('Carer', ['$resource',
  function($resource){
    return $resource('api/carer/:id', {}, {
      getCurrent: {method:'GET', url:'api/currentCarer', isArray:false},
      get: {method:'GET', params:{id: '@id'}, isArray:false},
      update: {method:'PUT', params:{id: '@id'}, isArray:false},
      updateRelation: {method:'PUT', params:{carerId: '@carerId', patientId: '@patientId' }, url:'/api/carer/:carerId/patients', isArray:false},
      delete: {method:'DELETE', params:{id: '@id'}, isArray:false},
    });
  }]);
})();