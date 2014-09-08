(function () {
  angular.module('DemS').directive("reminders", function() {
    return {
      restrict: 'A',
      templateUrl: "partials/reminders",
      controller: "RemindersController",
      controllerAs: "remindersCtrl",
    };
  });
})();