(function () {
	angular.module('DemS').controller('CarerController', ['$scope', 'Carer', 'Session', function($scope, Carer, Session){
    $scope.init = function () {
      $scope.carer = Carer.getCurrent({}, function (carer) {
        Session.currentCarer = carer;
      });
    };

    $scope.init();
	} ] );
})();