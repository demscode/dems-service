(function () {
	angular.module('DemS').config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl : '../views/partials/home.html',
			controller  :'HomeController'
		});

		$routeProvider.when('/patients', {
			templateUrl : '../views/partials/patients.html',
			controller  :'PatientsController'
		});

		$routeProvider.when('/virtual_fences', {
			templateUrl : '../views/partials/virtual_fences.html',
			controller  :'VirtualFencesController'
		});

		$routeProvider.when('/reminders', {
			templateUrl : '../views/partials/reminders.html',
			controller  :'RemindersController'
		});

		$routeProvider.when('/locations', {
			templateUrl : '../views/partials/locations.html',
			controller  :'LocationsController'
		});

		$routeProvider.when('/logs', {
			templateUrl : '../views/partials/logs.html',
			controller  :'LogsController'
		});

		$routeProvider.when('/account_details', {
			templateUrl : '../views/partials/account-details.html',
			controller  :'AccountDetailsController'
		});

		$routeProvider.otherwise({
			redirectTo : '/home'
		});
	} ] );
})();