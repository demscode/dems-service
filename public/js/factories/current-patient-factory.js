(function () {
  angular.module('DemS').factory('CurrentPatient', function () {
    var currentPatient = {};
    return {
      getCurrentPatient: function () {
          return currentPatient;
      },
      setCurrentPatient: function (patient) {
          currentPatient = patient;
      }
    };
  });
})();