(function () {
	angular.module('DemS').controller("ActivitiesController", ['$scope', 'Session', 'Activity', function($scope, Session, Activity){
    var self = this;

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) {
          $scope.patient = patient;
          self.refreshActivities();
        }
      });
    };

    self.refreshActivities = function () {
      Activity.getPatientsActivities({id:$scope.patient.id}, function(activities){
        $scope.activities = activities;
      });
    };

    self.showDate = function (date) {
      return new Date(date).toDateString();
    };

    self.showTime = function (date) {
      return new Date(date).toTimeString();
    };

    self.init();
  } ] );
})();