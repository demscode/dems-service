(function () {
  angular.module('DemS').controller("LocationsController", ['$scope', 'Session', function($scope, Session){
    var self = this;

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) $scope.patient = patient;
      });
    };

    self.init();
  } ] );
})();