(function () {
	angular.module('DemS').controller("AccountDetailsController", ['$scope', 'Carer', 'Session', 'Alerts', function($scope, Carer, Session, Alerts){
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
        Carer.update($scope.carer, $scope.carer);
        Session.currentCarer = $scope.carer;

        // What if it goes bad? No Promise.
        Alerts.addAlert("Successfully updated your details");
    };

    if(!Session.carerHasEnoughInfo(Session.currentCarer) && !Session.shownNotEnoughInfoMessage) {
        Alerts.addAlert("You need to add more information. Please visit the Account Details page", {alert_type: "danger"});
    }
  } ] );
})();