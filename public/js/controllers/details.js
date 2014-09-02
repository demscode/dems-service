(function () {
  angular.module('DemS').controller("DetailsController", ['$scope', 'Session', function($scope, Session){
    $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) $scope.patient = patient;
    });
  } ] );
})();