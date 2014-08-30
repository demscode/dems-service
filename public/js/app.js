/**
 * DemS
 *
 */
(function() {
	var app = angular.module('DemS', ['ngRoute']);

	app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/patients', {templateUrl: '../views/partials/patients.html'})
			$routeProvider.when('/logs', {templateUrl: '../views/partials/logs.html'})
			$routeProvider.when('/account_details', {templateUrl: '../views/partials/account-details.html'})
			$routeProvider.otherwise({redirectTo: '/patients'})
	}]);


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

	app.controller("CarerDetailsController", ['$http', function($http){
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
})();
