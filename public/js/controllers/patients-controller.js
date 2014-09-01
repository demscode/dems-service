(function () {
	angular.module('DemS').controller("PatientsController", ['$scope', '$http', 'CurrentPatient', function($scope, $http, CurrentPatient){

    $http.get("/api/test/patients").success(function(data) {
      $scope.patients = data;
    });

		$scope.setPatient = function (patientId) {
			$scope.patient = $scope.patients[patientId];
      CurrentPatient.setCurrentPatient($scope.patient);
		};

    $scope.addPatient = function () {
      console.log("Add Patient");
    };

    $scope.setTab = function(tab) {
      $(".tab-content > .tab-pane.active").removeClass("active");
      $(tab).addClass("active");
    };
  } ] );
})();