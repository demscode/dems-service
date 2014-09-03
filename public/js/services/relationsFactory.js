angular.module('DemS').factory('relationsFactory', ['$resource', function($resource){

	var relationsFactory = {};

	relationsFactory.addPatientToCarer = function(patientId, carerId){

		var url = '/carer/:carerId';

     var carerResource = $resource(url, {carerId:'@carerId'});
     carerResource.get({carerId:carerId}, function(carer) {
       carer.patients.put(patientId);
       carer.$save();
     });
	};

	// relationsFactory.removePatientFromCarer = function(patientId, carerId){
		
	// 	var url = '/carer/:'+carerId+'/relationship';
	// 	var parameters = {link: false, patientId : patientId};
		
	// 	$apiFactory.put(url,parameters);
	};

	return relationsFactory;
}]);