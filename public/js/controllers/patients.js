(function () {
	angular.module('DemS').controller("PatientsController", ['$scope', '$http', 'Session', 'Alerts', function($scope, $http, Session, Alerts){
    $scope.carer = Session.currentCarer;

    if(Session.hiddenSideBar) {
      $("#wrapper").addClass("toggled");
    }

    $http.get("/api/test/patients").success(function(data) {
      $scope.patients = data;
    });

		$scope.setPatient = function (patientId) {
			$scope.patient = $scope.patients[patientId];
      Session.currentPatient = $scope.patient;
      $('li[data-area="side-bar-link"] a').removeClass("active");
      $('li[data-area="side-bar-link"][data-patient-id="' + patientId + '"] a').addClass("active");
		};

    $scope.addPatient = function () {
      console.log("Add Patient");
    };

    $scope.setTab = function(tab) {
      $(".tab-content > .tab-pane.active").removeClass("active");
      $(tab).addClass("active");
    };

    $scope.toggleSideBar = function () {
      $("#wrapper").toggleClass("toggled");
      Session.hiddenSideBar = $("#wrapper").hasClass("toggled");
    };

    $scope.carerHasEnoughInfo = function () {
      return $scope.carer.contact_number !== null &&
             $scope.carer.contact_number !== undefined &&
             $scope.carer.contact_number !== "" &&
             $scope.carer.address !== null &&
             $scope.carer.address !== undefined &&
             $scope.carer.address !== "";
    };

    if(!$scope.carerHasEnoughInfo() && !Session.shownNotEnoughInfoMessage) {
      Alerts.addAlert("You need to add more information. Please visit the Account Details page", {alert_type: "danger"});
      Session.shownNotEnoughInfoMessage = true;
    }
  } ] );
})();