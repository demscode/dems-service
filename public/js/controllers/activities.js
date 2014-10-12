(function () {
	angular.module('DemS').controller("ActivitiesController", ['$scope', '$filter', '$q', 'ngTableParams', 'Session', 'Activity', 'Enum', function($scope, $filter, $q, ngTableParams, Session, Activity, Enum){
    var self = this;

    self.init = function () {
      Enum.get("activity_types", function(theEnum){
        $scope.activityTypes = theEnum;
        $scope.formattedActivityTypes = self.getFormattedActivityTypes();
      });

      setInterval(function(){
        self.refreshActivities(false);
        console.log("Refresh");
      }, 5000);

      $scope.$watch(function () { return Session.currentPatient; }, function (patient) {
        if (patient) {
          $scope.patient = patient;
          self.refreshActivities(true);
        }
      });
    };

    self.refreshActivities = function (patientChanged) {
      if(!$scope.patient) return;

      Activity.getPatientsActivities({id:$scope.patient.id}, function(activities){
        if(!patientChanged && $scope.allActivities.length === activities.length) {
          return;
        }
        $scope.activities = activities;
        $scope.allActivities = activities;

        for (var i = 0, length = $scope.activities.length; i < length; i++) {
          $scope.activities[i].formattedDate = self.getFormattedDate($scope.activities[i].time);
          $scope.activities[i].formattedTime = self.getFormattedTime($scope.activities[i].time);
          $scope.activities[i].formattedType = self.getFormattedType($scope.activities[i].type);
        }
        if(!$scope.tableParams) {
          $scope.tableParams = new ngTableParams({
            count: $scope.allActivities.length,
            sorting: {
                time: 'desc'     // initial sorting
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

              orderedData = $filter('orderBy')(orderedData, params.orderBy()[0], false);

              if(desc) {
                $scope.activities = orderedData;
              } else {
                $scope.activities = orderedData.slice();
              }

            }
          }
          );
        } else {
          if (patientChanged) {
            $scope.tableParams.sorting({time: 'desc'});
            $scope.tableParams.filter({});
            $("table#activities_table").find("input").removeClass("ng-dirty").addClass("ng-pristine");
            $("select#filterType").removeClass("ng-dirty").addClass("ng-pristine");
          }

          $scope.tableParams.reload();
        }

      });
    };

    self.getFormattedDate = function (dateNum) {
      date = new Date(dateNum);
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      return (dd[1] ? dd : "0" + dd[0]) + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + yyyy;
    };

    self.getFormattedTime = function (dateNum) {
      date = new Date(dateNum);
      var hh = date.getHours().toString();
      var mm = date.getMinutes();
      return hh + ":" + (mm > 9 ? mm : "0" + mm);
    };

    self.getFormattedType = function (type) {
      if(!$scope.activityTypes) {
        return type;
      }
      return $scope.activityTypes[type];
    };

    self.getFormattedActivityTypes = function () {
      var activity_types = [];

      for(var index in $scope.activityTypes) {
        if($scope.activityTypes.hasOwnProperty(index)) {
          activity_types.push({
            id: $scope.activityTypes[index],
            name: $scope.activityTypes[index]
          });
        }
      }
      return activity_types;
    };

    self.resetSorting = function () {
      $scope.tableParams.sorting({time: 'desc'});
      $scope.tableParams.reload();
    };

    self.resetFilters = function () {
      $("table#activities_table").find("input").removeClass("ng-dirty").addClass("ng-pristine");
      $("select#filterType").removeClass("ng-dirty").addClass("ng-pristine");
      $scope.tableParams.filter({});
      $scope.tableParams.reload();
    };

    self.init();
  } ] );
})();