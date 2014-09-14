(function () {
	angular.module('DemS').controller("RemindersController", ['$scope', 'Session','Reminder', function($scope, Session, Reminder){
    var self = this;
    var calendarOptions = {
      theme: true,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      selectable: true,
      select: function(start, end, jsEvent, view) {
        // Change to the date selected and go to the day view
        if(view.name === "agendaDay"){
          self.openAddEvent(start, end);
        } else {
          self.calendar.fullCalendar('gotoDate', start);
          self.calendar.fullCalendar('changeView', 'agendaDay');
        }
      },
      eventClick: function(calEvent, jsEvent, view) {
        self.openEditEvent(calEvent);
      },
      eventDragStop: function(calEvent, jsEvent, ui, view) {
        self.editEvent(calEvent);
      },

    };

    $scope.reminders = [];

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) {
          $scope.patient = patient;
          self.refreshReminders();
        }
      });

      $scope.$watch(function() { return Session.currentTab; }, function(tab) {
        if (tab == "reminders") {
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
        $scope.reminderEvents = self.getEventsFromReminders();
        self.initCalendar();
        console.log(reminders);
      });
    };

    self.getEventsFromReminders = function () {
      var reminderEvents = [];
      for (var i = 0, length = $scope.reminders.length; i < length; i++) {
        var reminderEvent = {
          title: $scope.reminders[i].name + " - " + $scope.reminders[i].message,
          start: new Date($scope.reminders[i].time),
          end: new Date(new Date($scope.reminders[i].time).getTime() + 60 * 60000),
          durationEditable: false,
        };
        reminderEvents.push(reminderEvent);
      }

      return reminderEvents;
    };


    self.editEvent = function (calEvent) {
      console.log("Edit event", calEvent);

      // api call to edit event
    };

    self.openEditEvent = function (calEvent) {
      console.log("Open modal to edit event", calEvent);

      // open up modal to edit the event
    };

    self.openAddEvent = function (start, end) {
      console.log("Open modal to add event from", start, "to", end);

      // open up a model to add the event
    };

    self.initCalendar = function () {
      if(self.calendar === undefined) {
        self.calendar = $("#calendar").fullCalendar(calendarOptions);
      } else {
        self.calendar.fullCalendar('destroy');
        self.calendar = $("#calendar").fullCalendar(calendarOptions);
      }
      self.calendar.fullCalendar('addEventSource', $scope.reminderEvents);

    };

    self.init();
  } ] );
})();