(function () {
  angular.module('DemS').factory('Session', function () {
    return {
      currentCarer: {},
      currentPatient: {},
      shownNotEnoughInfoMessage: false,
      hiddenSideBar: false
    };
  });
})();