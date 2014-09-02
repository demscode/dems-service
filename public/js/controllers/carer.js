(function () {
	angular.module('DemS').controller('CarerController', ['$scope', '$http', '$location', 'Session', function($scope, $http, $location, Session){
		$http.get("/api/currentCarer").success(function(data) {
			$scope.carer = data;
			Session.currentCarer = $scope.carer;
		});
	} ] );
})();