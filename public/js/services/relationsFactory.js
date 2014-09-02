angular.module('DemS').factory('relations', ['$apiFactory', function($apiFactory){

	var relationsFactory = {};

	relationsFactory.addPatientToCarer = function(patientId, carerId){

		var url = '/carer/:'+carerId+'/relationship';
		var parameters = {link: true, patiendId : patientId};
		
		$apiFactory.put(url,parameters);
	};

	relationsFactory.removePatientFromCarer = function(patientId, carerId){
		
		var url = '/carer/:'+carerId+'/relationship';
		var parameters = {link: false, patientId : patientId};
		
		$apiFactory.put(url,parameters);
	};

	return relationsFactory;
}]);