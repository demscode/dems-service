/**
 * DemS
 *
 */
(function() {
	var app = angular.module('DemS', ['ngRoute']);

	app.directive("frontPage", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/front-page"
	  };
	});

	app.controller('MainController', ['$http', '$location', function($http, $location){
  	this.setRoute = function(route){
    		$location.path(route);
  	};
	}]);

	app.controller("AccountDetailsController", ['$http', function($http){
		var ctrl = this;
		$http.get("/api/currentuser").success(function(data) {
			ctrl.carer = data;
		})
    ctrl.form = $("form[name='carerForm']")[0];

		this.pre_validate = function () {
			$.each($(ctrl.form).find("input[type='text'].ng-pristine"), function (i, elem) {
				$(elem).addClass("ng-dirty").removeClass("ng-pristine");
			});
			return true;
		};

    this.submit = function(){
    	console.log("doing the post")
      $(ctrl.form).submit();
    };
  } ] );

  app.controller("PatientsController", ['$http', function($http){
		this.patients = [
			{
				id: "123",
				first_name: "Frankie",
				last_name: "Ferraioli",
				contact_number: "0477 881 223",
				last_location: "Bedroom"
			},
			{
				id: "124",
				first_name: "Harley",
				last_name: "Jonelynas",
				contact_number: "0423 123 433",
				last_location: "Living Room"
			},
		]
  } ] );

  app.controller("LogsController", ['$http', function($http){
		this.logs = [
			{
				id: "1",
				log_info1: "hello",
				log_info2: "sup",
				log_info3: "YOO",
			},
			{
				id: "1",
				log_info1: "HAHAH",
				log_info2: "Oh Yeah",
				log_info3: "LOLOLOL",
			},
		]
  } ] );

  app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/patients', {templateUrl: '../views/partials/patients.html', controller:'PatientsController', controllerAs:'patientsCtrl'})
			$routeProvider.when('/logs', {templateUrl: '../views/partials/logs.html', controller:'LogsController', controllerAs:'logsCtrl'})
			$routeProvider.when('/account_details', {templateUrl: '../views/partials/account-details.html', controller:'AccountDetailsController', controllerAs:'accountCtrl'})
			$routeProvider.otherwise({redirectTo: '/patients'})
	}]);
})();
