angular.module('DemS').factory('relationsFactory', ['$resource', function($resource){

	var relationsFactory = {};

	relationsFactory.addPatientToCarer = function(carerId, patientId){

		var carerUrl = '/api/carer/:carerId/patients';
    var carerResource = $resource(carerUrl, {
      carerId:carerId,
      patientId:patientId
    },
    {
        update: { 
          method: 'PUT',
        }
      }
    );

    carerResource.update();
	};

	// relationsFactory.removePatientFromCarer = function(patientId, carerId){
		
	// 	var url = '/carer/:'+carerId+'/relationship';
	// 	var parameters = {link: false, patientId : patientId};
		
	// 	$apiFactory.put(url,parameters);
	// };

	return relationsFactory;
}]);