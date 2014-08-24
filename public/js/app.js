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
})();
