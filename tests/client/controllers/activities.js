describe('ActivitiesController', function() {
  var $rootScope,
      $scope,
      controller,
      Session,
      createController;

  beforeEach(function() {
    module("DemS");

    Session = {
      currentCarer: null,
      currentPatient: null,
      shownNotEnoughInfoMessage: function (carer) {
        return true;
      },
      hiddenSideBar: false,
      carerHasEnoughInfo: false,
    };
    inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      createController = function () {
        controller = $injector.get('$controller')("ActivitiesController", {$scope: $scope, Session: Session});
      };

      createController();
    });
  });

  it("test controller watches for changes in the session's current patient", function () {
    expect($scope.patient).toBe(undefined);
    expect(Session.currentPatient).toBe(null);

    Session.currentPatient = "testing";
    expect(Session.currentPatient).toBe("testing");
    $scope.$apply();
    expect($scope.patient).toBe("testing");

    Session.currentPatient = "testing again";
    expect(Session.currentPatient).toBe("testing again");
    $scope.$apply();
    expect($scope.patient).not.toBe("testing");
    expect($scope.patient).toBe("testing again");
  });
});