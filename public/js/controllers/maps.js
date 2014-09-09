(function() {
  angular.module('DemS').controller('MapsController', function(Location, Fence, $scope, Session) {
    var self = this;
    var map, marker;
    var showAll = false;
    var count = 0;
    $scope.inside = true;

    $scope.fences = [];

    self.mapSettings =  {
      div: '#map',
      lat: -27.4679,
      lng: 153.0278
    };

    self.CreateMap = function(settings) {
      self.map = GMaps(settings);
    };

    self.CreatePolygon = function(paths) {
      return self.map.drawPolygon({
        paths: paths,
        editable: true,
        strokeColor: '#66b266',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#b2d8b2',
        fillOpacity: 0.6
      });
    };


    self.CreateMarker = function(position, current) {
      if (current) {
        count = 0;
      }
      self.marker = self.map.addMarker({
        lat: position.latitude,
        lng: position.longitude,
        draggable: false,
        fences: self.map.polygons,
        outside: function(marker, fence) { },
        infoWindow: {
          content: Date(position.timestamp)
        }
      });
    };

    self.CheckPatientInBounds = function(patientid) {
      console.log($scope.fences);
      Location.query({id: patientid}, function(data) {
        lastloc = data[data.length-1];
        var count = 0;
        for (var i = 0; i < $scope.fences.length; i++) {
          var infence = self.map.checkGeofence(lastloc.latitude, lastloc.longitude, $scope.fences[i].polygon);
          if (infence === false) {
            count++;
          }
        }
        if (count === $scope.fences.length) {
          $scope.inside = false;
        } else {
          $scope.inside = true;
        }
      });
    };

    self.GetUpdatedPath = function(polygon) {
      var polyobj = polygon.latLngs.j[0].j;
      paths = [];
      for(var j = 0; j < polyobj.length; j++) {
        paths.push([polyobj[j].k, polyobj[j].B]);
      }
      return paths;
    };

    self.SaveUpdatedPolygons = function(patientid) {
      for (var i = 0; i < $scope.fences.length; i++) {
        var paths = self.GetUpdatedPath($scope.fences[i].polygon);
        if ($scope.fences[i].id === null) {
          Fence.save({id: patientid}, {polygon: paths});
        } else {
          Fence.update({id: patientid, fid: $scope.fences[i].id}, {polygon: paths});
        }
      }

      Fence.query({ id: patientid }, function(data) {
        var freeids = [];
        for (var i = 0; i < data.length; i++) {
          var used = false;
          for (var j = 0; j < $scope.fences.length; j++) {
            if ($scope.fences[j].id === data[i].id) {
              used = true;
            }
          }

          if (used === false) {
            freeids.push(data[i].id);
          }
        }

        freeids.reverse();
        for (var k = 0; k < $scope.fences.length; k++) {
          if ($scope.fences[k].id === null) {
            $scope.fences[k].id = freeids.pop();
          }
        }
      });

      self.CheckPatientInBounds(patientid);
    };

    self.AddFences = function(patientid) {
      Fence.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          $scope.fences[i] = {
            id: data[i].id,
            polygon: self.CreatePolygon(data[i].polygon),
            polygonlatlngs: data[i].polygon,
            name: data[i].name,
          };
        }
      });
    };

    self.AddMostRecentMarker = function(patientid) {
      Location.query({ id: patientid }, function(data) {
        self.CreateMarker(data[data.length-1]);
        self.map.setCenter(data[data.length-1].latitude, data[data.length-1].longitude);
      });
    };

    self.AddMarkersInRange = function(patientid, start, end) {
      Location.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data.timestamp > Number(start) && data.timestamp < Number(end)) {
            self.CreateMarker(data[i]);
          }
        }
      });
    };

    self.ClearMarkers = function() {
      self.map.removeMarkers();
      markersOutOfBounds = [];
    };

    self.ClearPolygons = function() {
      for (var i = 0; i < $scope.fences.length; i++) {
        $scope.fences[i].polygon.setMap(null);
      }
      $scope.fences = [];
    };

    self.EnableFenceMaking = function() {
      self.map.setContextMenu({
        control: 'map',
        options: [{
          title: 'Triangle',
          name: 'triangle',
          action: function(e) {
            var lat = e.latLng.lat(),
                lng = e.latLng.lng();
            var path = self.getTrianglePolygon(lat, lng);
            $scope.fences[$scope.fences.length] = {
              id: null,
              polygon: self.CreatePolygon(path),
              polygonlatlngs: path,
              name: prompt("Enter a name for the fence"),
            };
          }
        },
        {
          title: 'Square',
          name: 'square',
          action: function(e) {
            var lat = e.latLng.lat(),
                lng = e.latLng.lng();
            var path = self.getSquarePolygon(lat, lng);
            $scope.fences[$scope.fences.length] = {
              id: null,
              polygon: self.CreatePolygon(path),
              polygonlatlngs: path,
              name: prompt("Enter a name for the fence"),
            };
          }
        }]
      });

    };

    self.getTrianglePolygon = function(lat, lng) {
      return [[lat, lng], [lat+0.0015, lng-0.003], [lat-0.003, lng+0.0015]];
    };

    self.getSquarePolygon = function(lat, lng) {
      return [[lat, lng], [lat+0.003, lng], [lat+0.003, lng+0.003], [lat, lng+0.003]];
    };

    self.RevertFenceChanges = function(patientid) {
      self.ClearPolygons();
      self.AddFences(patientid);
    };

    self.CurrentLocation = function(patientid) {
      self.ClearMarkers();
      self.AddMostRecentMarker(patientid);
      showAll = false;
    };

    self.LocationsBetweenDates = function(patientid, startdate, enddate) {
      self.ClearMarkers();
      self.AddMarkersInRange(patientid, Date(startdate), Date(enddate));
    };

    self.ShowAll = function(patientid) {
      self.ClearMarkers();
      Location.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          self.CreateMarker(data[i]);
        }
        self.map.setCenter(data[data.length-1].latitude, data[data.length-1].longitude);
      });
      showAll = true;
    };

    self.moveToFence = function(index) {
      var fence = $scope.fences[index];
      self.map.setCenter(fence.polygonlatlngs[0][0], fence.polygonlatlngs[0][1]);
    };

    self.init = function(patientid) {
     console.log("Entering init");
      if (self.map === undefined) {
        self.CreateMap(self.mapSettings);
      } else {
        self.ClearMarkers();
        self.ClearPolygons();
      }

      self.AddFences(patientid);

      if (showAll) {
        self.ShowAll(patientid);
      } else {
        self.CurrentLocation(patientid);
      }
      self.EnableFenceMaking();
      self.CheckPatientInBounds(patientid);
    };

    $scope.$watch(function() { return Session.currentPatient; }, function(newPatient, oldPatient) {
      console.log('current patient changed from', oldPatient, 'to', newPatient);
      $scope.patient = newPatient;
      if (Session.mapLoaded){
        console.log('map loaded & id changed');
        if (newPatient !== undefined) {
          console.log('id no undefined');
          if (self.map !== undefined) {
            console.log('map is not undefined');
            self.init(newPatient.id);
          }
        }
      }
    });

    $scope.$watch(function() { return Session.currentTab; }, function(tab) {
      if (!Session.mapLoaded && tab == "locations") {
        console.log('locations tab selected and map no loaded');
        self.init(Session.currentPatient.id);
        Session.mapLoaded = true;
      }
    });
  });
})();
