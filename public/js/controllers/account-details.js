(function () {
  angular.module('DemS').controller("AccountDetailsController", ['$scope', 'Carer', 'Session', 'Alerts', function($scope, Carer, Session, Alerts){
    var self = this;

    self.init = function () {
      $scope.carer = Session.currentCarer;

      self.form = $("form[name='carerForm']")[0];

      if(!Session.carerHasEnoughInfo(Session.currentCarer) && !Session.shownNotEnoughInfoMessage) {
        Alerts.addAlert("You need to add more information. Please enter them by feeling out this form", {alert_type: "danger"});
        Session.shownNotEnoughInfoMessage = true;
      }

      Session.mapLoaded = false;
      Session.currentTab = null;
    };

    self.post_validate = function () {
      $.each($(self.form).find("input[type='text'].ng-pristine"), function (i, elem) {
        $(elem).addClass("ng-dirty").removeClass("ng-pristine");
      });
      Alerts.addAlert("Please check your input as something is invalid", {alert_type: "danger"});
      return false;
    };

    self.submit = function(){
      $scope.carer.$update(function () {
        // Success
        Session.currentCarer = $scope.carer;
        Alerts.addAlert("Successfully updated your details");
      }, function () {
        // Error
        Alerts.addAlert("Something has gone wrong.", {alert_type: "danger"});
      });
    };

    self.init();
  } ] );
})();
