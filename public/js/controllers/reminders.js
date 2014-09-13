(function () {
	angular.module('DemS').controller("RemindersController", ['$scope', 'Session', function($scope, Session){
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
      disableResizing: true,
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

    self.events = [
      {
        title: 'Frankie Rules',
        start: Date.now(),
        end: Date.now() + 60 * 60000,
      }
    ];

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) $scope.patient = patient;
      });

      $scope.$watch(function() { return Session.currentTab; }, function(tab) {
        if (!Session.calendarLoaded && tab == "reminders") {
          Session.calendarLoaded = true;
          self.initCalendar(Session.currentPatient.id);
        }
      });
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

    self.initCalendar = function (patientId) {
      self.calendar = $("#calendar").fullCalendar(calendarOptions);
      self.calendar.fullCalendar('addEventSource', self.events);
    };

    self.init();
  } ] );
})();