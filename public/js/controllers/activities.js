(function () {
	angular.module('DemS').controller("ActivitiesController", ['$scope', '$filter', 'ngTableParams', 'Session', 'Activity', function($scope, $filter, ngTableParams, Session, Activity){
    var self = this;

    self.init = function () {
      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) {
          $scope.patient = patient;
          self.refreshActivities();
          if($scope.tableParams) {
            $scope.tableParams.sorting({});
            $scope.tableParams.filter({});
            $("table#activities_table").find("input").removeClass("ng-dirty").addClass("ng-pristine");
          }
        }
      });

    };

    self.refreshActivities = function () {
      Activity.getPatientsActivities({id:$scope.patient.id}, function(activities){
        $scope.activities = activities;
        $scope.allActivities = activities;

        for (var i = 0, length = $scope.activities.length; i < length; i++) {
          $scope.activities[i].formattedDate = self.showDate($scope.activities[i].time);
          $scope.activities[i].formattedTime = self.showTime($scope.activities[i].time);
        }
        if(!$scope.tableParams) {
          $scope.tableParams = new ngTableParams({
            count: $scope.allActivities.length,
            sorting: {
                name: 'asc'     // initial sorting
            }
          },
          {
            counts: [], // hides page sizes
            total: $scope.allActivities.length, // length of data
            getData: function($defer, params) {
              // use build-in angular filter

              var desc = false;
              if(params.orderBy().length == 1) {
                desc = params.sorting()[(params.orderBy()[0]).slice(1)] == "desc";
              }
              var orderedData = $scope.allActivities;

              orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

              orderedData = $filter('orderBy')(orderedData, params.orderBy()[0], true);

              if(desc) {
                $scope.activities = orderedData;
              } else {
                $scope.activities = orderedData.slice();
              }

            }
          }
          );
        }

      });
    };

    self.showDate = function (date) {
      return new Date(date).toDateString();
    };

    self.showTime = function (date) {
      return new Date(date).toTimeString();
    };

    self.init();
  } ] );
})();