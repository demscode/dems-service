(function () {
	angular.module('DemS').controller('CarerController', ['$scope', 'Carer', 'Session', function($scope, Carer, Session){
    var self = this;

    self.init = function () {
      $scope.carer = Carer.getCurrent({}, function (carer) {
        Session.currentCarer = carer;
      });
    };

    self.init();
	} ] );
})();