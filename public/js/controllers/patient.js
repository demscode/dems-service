(function () {
	angular.module('DemS').controller("PatientsController", ['$scope', '$http', 'relationsFactory',
    function($scope, $http, relationsFactory){
  		$http.get("/api/test/patients").success(function(data) {
        $scope.patients = data;
      });

  		$scope.setPatient = function (patientId) {
  			$scope.patient = $scope.patients[patientId];
  		};

      $scope.saveNewPatient = function () {
        var carerId = 130;
        relationsFactory.addPatientToCarer(carerId, $scope.newPatient.id);
      };
    }]);
})();