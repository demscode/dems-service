(function () {
	angular.module('DemS').controller('CarerController', ['$scope', 'Carer', 'Session', function($scope, Carer, Session){
    $scope.carer = Carer.getCurrent();
     Session.currentCarer = $scope.carer;
	} ] );
})();