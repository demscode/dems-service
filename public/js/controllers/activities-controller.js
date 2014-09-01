(function () {
	angular.module('DemS').controller("ActivitiesController", ['$scope', '$http', 'CurrentPatient', function($scope, $http, CurrentPatient){
    $scope.$watch(function () { return CurrentPatient.getCurrentPatient(); }, function (patient) {
        if (patient) $scope.patient = patient;
    });
  } ] );
})();