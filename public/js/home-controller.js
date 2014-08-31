(function () {
	angular.module('DemS').controller('HomeController', ['$scope', '$http', '$location', function($scope, $http, $location){
		$http.get("/api/currentCarer").success(function(data) {
			$scope.carer = data;
		});
	} ] );
})();