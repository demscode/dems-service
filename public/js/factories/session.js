(function () {
  angular.module('DemS').factory('Session', function () {
    var currentCarer = null,
      currentPatient = null,
      shownNotEnoughInfoMessage = false,
      hiddenSideBar = false,
      currentTab = null,
      mapLoaded = false,
      calendarLoaded = false;

    var carerHasEnoughInfo = function (carer) {
      return carer !== null &&
             carer.contact_number !== null &&
             carer.contact_number !== undefined &&
             carer.contact_number !== "" &&
             carer.address !== null &&
             carer.address !== undefined &&
             carer.address !== "";
    };

    return {
      currentCarer: currentCarer,
      currentPatient: currentPatient,
      shownNotEnoughInfoMessage: shownNotEnoughInfoMessage,
      hiddenSideBar: hiddenSideBar,
      carerHasEnoughInfo: carerHasEnoughInfo,
      currentTab: currentTab,
      mapLoaded: mapLoaded,
      calendarLoaded: calendarLoaded,
    };
  });
})();