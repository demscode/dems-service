/**
 * DemS
 *
 */
(function() {
	function addAlert (msg, options) {
		if(options == undefined) options = {};
		if(options.alert_type == undefined) options.alert_type = "success";
		if(options.remove == undefined) options.remove = true;
		if(options.timeout == undefined) options.timeout = 5000;
		if(options.placement == undefined) options.placement = "after";

		var alerts_area = $("div#alerts")[0];

		var alert = '<div class="alert alert-' + options.alert_type + '">'  +
								  msg + '<a class="close" data-dismiss="alert">×</a>' +
								'</div>';
		alert = $.parseHTML(alert);

		if(options.placement == "before") {
			$(alerts_area).prepend(alert);
		} else {
			$(alerts_area).append(alert);
		}

		if(options.remove) {
			window.setTimeout(function() {
		    $(alert).fadeTo(500, 0).slideUp(500, function() {
		        $(alert).remove();
		    });
			}, options.timeout);
		}
	}

	var app = angular.module('DemS', ['ngRoute', 'DemS.services']);

	app.directive("frontPage", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/front-page"
	  };
	});

	app.controller('CarerController', ['$scope', '$http', '$location', 'Carer', function($scope, $http, $location, Carer){
		$http.get("/api/currentCarer").success(function(data) {
			$scope.carer = data;
			addAlert("Welcome " + $scope.carer.name, {remove: false});
			if(!$scope.carerHasEnoughInfo()) {
				addAlert("You need to add more information. Please visit the Account Details page", {alert_type: "danger"});
			}
		});

		$scope.carerHasEnoughInfo = function () {
			return $scope.carer.contact_number != null &&
						 $scope.carer.contact_number != "" &&
						 $scope.carer.address != null &&
						 $scope.carer.address != "";
		}
	} ] );

  app.controller("PatientsController", ['$scope', '$http', function($scope, $http){
		$scope.patients = [
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

  app.controller("LogsController", ['$scope', '$http', function($scope, $http){
		$scope.logs = [
			{
				id: "1",
				log_info1: "hello",
				log_info2: "sup",
				log_info3: "YOO",
			},
			{
				id: "2",
				log_info1: "HAHAH",
				log_info2: "Oh Yeah",
				log_info3: "LOLOLOL",
			},
		]
  } ] );

  app.controller("AccountDetailsController", ['$scope', '$http', function($scope, $http){
		$http.get("/api/currentCarer").success(function(data) {
			$scope.carer = data;
		});
    $scope.form = $("form[name='carerForm']")[0];

		$scope.post_validate = function () {
			$.each($($scope.form).find("input[type='text'].ng-pristine"), function (i, elem) {
				$(elem).addClass("ng-dirty").removeClass("ng-pristine");
			});
			addAlert("Please check your input as something is invalid", {alert_type: "danger"})
			return false;
		};

    $scope.submit = function(){
      $http({
            url: '/api/carer/' + $scope.carer.id,
            method: "PUT",
            data: $.param($scope.carer),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data, status, headers, config) {
        	addAlert("Successfully updated your details")
        }).error(function (data, status, headers, config) {
            // error
        });
    };
  } ] );

  app.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/patients', {templateUrl: '../views/partials/patients.html', controller:'PatientsController'})
			$routeProvider.when('/logs', {templateUrl: '../views/partials/logs.html', controller:'LogsController'})
			$routeProvider.when('/account_details', {templateUrl: '../views/partials/account-details.html', controller:'AccountDetailsController'})
			$routeProvider.otherwise({redirectTo: '/patients'})
	} ] );
})();
