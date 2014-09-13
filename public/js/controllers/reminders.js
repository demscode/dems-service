(function () {
	angular.module('DemS').controller("RemindersController", ['$scope', 'Session','Reminder', function($scope, Session, Reminder){
    var self = this;
    $scope.reminders = [];

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) {
          $scope.patient = patient;
          self.refreshReminders();
        }
      });
    };

    self.addNewReminder = function(){
      Reminder.save({id:$scope.patient.id}, {name:$scope.newReminder.name, time:$scope.newReminder.time, type:$scope.newReminder.type, message:$scope.newReminder.message}, function(message){
        self.refreshReminders();
      });
    };

    self.removeReminder = function(reminderId){
      Reminder.delete({id:$scope.patient.id, reminderId:reminderId}, function(message){
        self.refreshReminders();
      });
    };

    self.refreshReminders = function(){
      Reminder.getPatientsReminders({id:$scope.patient.id}, function(reminders){
        $scope.reminders = reminders;
        console.log(reminders);
      });
    };

    self.init();
  } ] );
})();