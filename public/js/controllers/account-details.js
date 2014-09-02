(function () {
	angular.module('DemS').controller("AccountDetailsController", ['$scope', '$http', 'Session', 'Alerts', function($scope, $http, Session, Alerts){
	$scope.carer = Session.currentCarer;

    $scope.form = $("form[name='carerForm']")[0];

	$scope.post_validate = function () {
		$.each($($scope.form).find("input[type='text'].ng-pristine"), function (i, elem) {
			$(elem).addClass("ng-dirty").removeClass("ng-pristine");
		});
		Alerts.addAlert("Please check your input as something is invalid", {alert_type: "danger"});
		return false;
	};

    $scope.submit = function(){
      $http({
            url: '/api/carer/' + $scope.carer.id,
            method: "PUT",
            data: $.param($scope.carer),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
        	Alerts.addAlert("Successfully updated your details");
        }).error(function (data, status, headers, config) {
            // error
        });
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