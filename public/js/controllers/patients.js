(function () {
	angular.module('DemS').controller("PatientsController", ['$scope', '$http', 'Session', 'Alerts', function($scope, $http, Session, Alerts){
    $scope.carer = Session.currentCarer;

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

    $scope.toggleSideBar = function (animation) {
      $("#wrapper").toggleClass("toggled");

      if(animation) {
        $("#toggle").animate({width: Session.hiddenSideBar ? "250px" : "30px"}, 400);
        $("#toggle > b").toggleClass("caret-right").toggleClass("caret-left");
      } else {
        if(Session.hiddenSideBar) {
          $("#toggle").css("width", "250px");
        } else {
          $("#toggle").css("width", "30px");
        }
      }

      Session.hiddenSideBar = $("#wrapper").hasClass("toggled");

    };

    if(!Session.carerHasEnoughInfo(Session.currentCarer) && !Session.shownNotEnoughInfoMessage) {
      Alerts.addAlert("You need to add more information. Please visit the Account Details page", {alert_type: "danger"});
      Session.shownNotEnoughInfoMessage = true;
    }

    if(Session.hiddenSideBar) {
      $scope.toggleSideBar(false);
    }
  } ] );
})();