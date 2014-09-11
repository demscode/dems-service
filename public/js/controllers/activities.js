(function () {
	angular.module('DemS').controller("ActivitiesController", ['$scope', 'Session', function($scope, Session){
    var self = this;

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) $scope.patient = patient;
      });
    };

    self.init();
  } ] );
})();