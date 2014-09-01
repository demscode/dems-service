(function () {
	angular.module('DemS').controller('CarerController', ['$scope', '$http', '$location', 'Alerts', function($scope, $http, $location, Alerts){
		$http.get("/api/currentCarer").success(function(data) {
			$scope.carer = data;
			if(!$scope.carerHasEnoughInfo()) {
				Alerts.addAlert("You need to add more information. Please visit the Account Details page", {alert_type: "danger"});
			}
		});

		$scope.carerHasEnoughInfo = function () {
			return $scope.carer.contact_number !== null &&
						 $scope.carer.contact_number !== undefined &&
						 $scope.carer.contact_number !== "" &&
						 $scope.carer.address !== null &&
						 $scope.carer.address !== undefined &&
						 $scope.carer.address !== "";
		};
	} ] );
})();