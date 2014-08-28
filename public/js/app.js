/**
 * DemS
 *
 */
(function() {
	var app = angular.module('DemS', []);

	// app.directive('', function(){
	// 	return{
	// 		restrict:'E',
	// 		templateUrl: ''
	// 	};
	// });

	app.directive("frontPage", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/front-page"
	  };
	});

	app.directive("carerView", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/carer-view"
	  };
	});

	app.directive("patients", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/patients"
	  };
	});

	app.directive("logs", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/logs"
	  };
	});

	app.directive("accountDetails", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "partials/account-details"
	  };
	});

	app.controller('TabController', function(){
    	this.tab = 1;

    	this.setTab = function(newValue){
      		this.tab = newValue;
    	};

    	this.isSet = function(tabName){
      		return this.tab === tabName;
    	};

    	this.value = function(){
    		return this.tab;
    	};
  	});

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
