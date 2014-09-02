(function () {
	angular.module('DemS').controller("LocationsController", ['$scope', '$http', 'Session', function($scope, $http, Session){
		$scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) $scope.patient = patient;
    });
  } ] );
})();