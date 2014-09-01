(function () {
	angular.module('DemS').config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/patients', {
			templateUrl : '../views/partials/patients.html',
			controller  :'PatientsController'
		});

		$routeProvider.when('/account_details', {
			templateUrl : '../views/partials/account-details.html',
			controller  :'AccountDetailsController'
		});

		$routeProvider.otherwise({
			redirectTo : '/patients'
		});
	} ] );
})();