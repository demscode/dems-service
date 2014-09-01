(function () {
	angular.module('DemS').controller("AccountDetailsController", ['$scope', '$http', 'Alerts', function($scope, $http, Alerts){
		$http.get("/api/currentCarer").success(function(data) {
			$scope.carer = data;
		});
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
  } ] );
})();