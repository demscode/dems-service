describe('PatientsController', function() {
  var $rootScope,
      $scope,
      $http,
      controller,
      Session,
      createController,
      patients,
      orderedPatientsByName,
      patientsObject,
      patients1,
      patients2;

  beforeEach(function() {
    module("DemS");

    patient1 = {
      id: "1",
      name: "Frankie"
    };

    patient2 = {
      id: "2",
      name: "Albert"
    };

    patients = [patient1, patient2];

    patientsObject = {};

    for (var i = 0, length = patients.length; i < length; i++) {
      patientsObject[patients[i].id] = patients[i];
    }

    orderedPatientsByName = [patient2, patient1];

    Session = {
      currentCarer: null,
      currentPatient: null,
      shownNotEnoughInfoMessage: false,
      hiddenSideBar: false,
      carerHasEnoughInfo: function (carer) {
        return true;
      },
    };

    var Alerts = {
      addAlert: function (msg, options) {
        return;
      }
    };

    inject(function ($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $http = $injector.get('$http');

      $httpBackend = $injector.get('$httpBackend');

      $httpBackend.whenGET('/api/allPatients')
        .respond(patients);

      createController = function () {
        controller = $injector.get('$controller')("PatientsController", {$scope: $scope, $http: $http, Session: Session, Alerts: Alerts});
      };

      createController();
    });
  });

  it("does not call toggleSideBar if hiddenSideBar is false", function () {
    spyOn($scope, 'toggleSideBar');
    Session.hiddenSideBar = false;
    $scope.init();
    expect($scope.toggleSideBar).not.toHaveBeenCalled();
  });

  it("does call toggleSideBar if hiddenSideBar is true", function () {
    spyOn($scope, 'toggleSideBar');
    Session.hiddenSideBar = true;
    $scope.init();
    expect($scope.toggleSideBar).toHaveBeenCalled();
  });

  it("gets the array of patients from backend and orders them by name", function () {
    $httpBackend.flush();
    expect($scope.arrayOfPatients).toEqual(orderedPatientsByName);
  });

  it("gets the patients object from the array taken from the backend", function () {
    $httpBackend.flush();
    expect($scope.patients).toEqual(patientsObject);
  });

  it("sets the patient in the session", function () {
    $httpBackend.flush();
    expect(Session.currentPatient).toEqual(null);
    $scope.setPatient("1");
    expect(Session.currentPatient).toEqual(patient1);
  });
});