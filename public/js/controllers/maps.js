(function() {
  angular.module('DemS').controller('MapsController', function(Location, Fence, $scope, Session) {
    var self = this;
    var map, marker;
    var showAll = false;
    var count = 0;
    $scope.inside = true;

    self.fences = [];

    self.mapSettings =  {
      div: '#map',
      lat: -27.4679,
      lng: 153.0278
    };

    self.createMap = function(settings) {
      self.map = GMaps(settings);
    };

    self.createPolygon = function(paths) {
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


    self.createMarker = function(position, current) {
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

    self.checkPatientInBounds = function(patientid) {
      console.log(self.fences);
      Location.query({id: patientid}, function(data) {
        lastloc = data[data.length-1];
        var count = 0;
        for (var i = 0; i < self.fences.length; i++) {
          var infence = self.map.checkGeofence(lastloc.latitude, lastloc.longitude, self.fences[i].polygon);
          if (infence === false) {
            count++;
          }
        }
        if (count === self.fences.length) {
          $scope.inside = false;
        } else {
          $scope.inside = true;
        }
      });
    };

    self.getUpdatedPath = function(polygon) {
      var polyobj = polygon.latLngs.j[0].j;
      paths = [];
      for(var j = 0; j < polyobj.length; j++) {
        paths.push([polyobj[j].k, polyobj[j].B]);
      }
      return paths;
    };

    self.saveUpdatedPolygons = function(patientid) {
      for (var i = 0; i < self.fences.length; i++) {
        var paths = self.getUpdatedPath(self.fences[i].polygon);
        if (self.fences[i].id === null) {
          Fence.save({id: patientid}, {polygon: paths});
        } else {
          Fence.update({id: patientid, fid: self.fences[i].id}, {polygon: paths});
        }
      }

      Fence.query({ id: patientid }, function(data) {
        var freeids = [];
        for (var i = 0; i < data.length; i++) {
          var used = false;
          for (var j = 0; j < self.fences.length; j++) {
            if (self.fences[j].id === data[i].id) {
              used = true;
            }
          }

          if (used === false) {
            freeids.push(data[i].id);
          }
        }

        freeids.reverse();
        for (var k = 0; k < self.fences.length; k++) {
          if (self.fences[k].id === null) {
            self.fences[k].id = freeids.pop();
          }
        }
      });

      self.checkPatientInBounds(patientid);
    };

    self.addFences = function(patientid) {
      Fence.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          self.fences[i] = {
            id: data[i].id,
            polygon: self.createPolygon(data[i].polygon),
            name: data[i].name,
          };
        }
      });
    };

    self.addMostRecentMarker = function(patientid) {
      Location.query({ id: patientid }, function(data) {
        self.createMarker(data[data.length-1]);
        self.map.setCenter(data[data.length-1].latitude, data[data.length-1].longitude);
      });
    };

    self.addMarkersInRange = function(patientid, start, end) {
      Location.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data.timestamp > Number(start) && data.timestamp < Number(end)) {
            self.createMarker(data[i]);
          }
        }
      });
    };

    self.clearMarkers = function() {
      self.map.removeMarkers();
      markersOutOfBounds = [];
    };

    self.clearPolygons = function() {
      for (var i = 0; i < self.fences.length; i++) {
        self.fences[i].polygon.setMap(null);
      }
      self.fences = [];
    };

    self.enableFenceMaking = function() {
      self.map.setContextMenu({
        control: 'map',
        options: [{
          title: 'Triangle',
          name: 'triangle',
          action: function(e) {
            var lat = e.latLng.lat(),
                lng = e.latLng.lng();
            var path = self.getTrianglePolygon(lat, lng);
            self.fences[self.fences.length] = {
              id: null,
              polygon: self.createPolygon(path),
              name: "",
            };
            self.editFenceName($scope.patient.id, self.fences.length - 1);
          }
        },
        {
          title: 'Square',
          name: 'square',
          action: function(e) {
            var lat = e.latLng.lat(),
                lng = e.latLng.lng();
            var path = self.getSquarePolygon(lat, lng);
            self.fences[self.fences.length] = {
              id: null,
              polygon: self.createPolygon(path),
              name: "",
            };
            self.editFenceName($scope.patient.id, self.fences.length - 1);
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

    self.revertFenceChanges = function(patientid) {
      self.clearPolygons();
      self.addFences(patientid);
    };

    self.currentLocation = function(patientid) {
      self.clearMarkers();
      self.addMostRecentMarker(patientid);
      showAll = false;
    };

    self.locationsBetweenDates = function(patientid, startdate, enddate) {
      self.clearMarkers();
      self.addMarkersInRange(patientid, Date(startdate), Date(enddate));
    };

    self.showAll = function(patientid) {
      self.clearMarkers();
      Location.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          self.createMarker(data[i]);
        }
        self.map.setCenter(data[data.length-1].latitude, data[data.length-1].longitude);
      });
      showAll = true;
    };

    self.moveToFence = function(index) {
      var fence = self.fences[index];
      self.map.setCenter(self.getUpdatedPath(fence.polygon)[0][0], self.getUpdatedPath(fence.polygon)[0][1]);
    };

    self.editFenceName = function(patientId, index) {
      $("#editFenceNameInput").val(self.fences[index].name);
      $("#editFenceModal").modal({backdrop: 'static', keyboard: false});
      $("#editFenceModal").modal('show');

      $('#editFenceModal').on('hidden.bs.modal', function () {
        self.fences[index].name = $("#editFenceNameInput").val();
        if(self.fences[index].id === null){
          Fence.save({id: patientId}, {
            polygon: self.getUpdatedPath(self.fences[index].polygon),
            name: self.fences[index].name,
          }, function (data) {
            self.fences[index].id = data.id;
          });
        } else {
          Fence.update({id: patientId, fid: self.fences[index].id}, {
            name: self.fences[index].name,
          });
        }

        $('#editFenceModal').unbind('hidden.bs.modal');
        self.checkPatientInBounds(patientId);
      });
    };

    self.deleteFence = function(patientId, index) {
      Fence.delete({id: patientId, fid: self.fences[index].id});
      self.fences[index].polygon.setMap(null);
      self.fences.splice(index, 1);
      self.checkPatientInBounds(patientId);
    };

    self.init = function(patientid) {
     console.log("Entering init");
      if (self.map === undefined) {
        self.createMap(self.mapSettings);
      } else {
        self.clearMarkers();
        self.clearPolygons();
      }

      self.addFences(patientid);

      if (showAll) {
        self.showAll(patientid);
      } else {
        self.currentLocation(patientid);
      }
      self.enableFenceMaking();
      self.checkPatientInBounds(patientid);
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
