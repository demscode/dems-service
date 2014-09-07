/**
 * DemS.maps
 *
 */


(function() {
	var app = angular.module('DemS.maps', ['ngResource']);

  app.factory("Patient", function($resource) {
    return $resource('/api/patient/:id');
  });

  app.factory("Location", function($resource) {
    return $resource('/api/patient/:id/locations');
  });

  app.factory("Fence", function($resource) {
    return $resource('/api/patient/:id/fence/:fid', {}, {
      update: {
        method: 'PUT'
      }
    });
  });

  app.controller('MapsController', function(Location, Fence, $scope, Session) {
    var maps = this;
    var map, marker;
    var fences = [];
    var showAll = false;
    var count = 0;
    $scope.inside = true;

    this.mapSettings =  {
      div: '#map',
      lat: -27.4679,
      lng: 153.0278
    };

    this.CreateMap = function(settings) {
      maps.map = GMaps(settings);
    };

    this.CreatePolygon = function(paths) {
      return maps.map.drawPolygon({
        paths: paths,
        editable: true,
        strokeColor: '#66b266',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#b2d8b2',
        fillOpacity: 0.6
      });
    };


    this.CreateMarker = function(position, current) {
      if (current) {
        count = 0;
      }
      maps.marker = maps.map.addMarker({
        lat: position.latitude,
        lng: position.longitude,
        draggable: false,
        fences: maps.map.polygons,
        outside: function(marker, fence) { },
        infoWindow: {
          content: Date(position.timestamp)
        }
      });
    };

    this.CheckPatientInBounds = function(patientid) {
      console.log(fences);
      Location.query({id: patientid}, function(data) {
        lastloc = data[data.length-1];
        var count = 0;
        for (var i = 0; i < fences.length; i++) {
          var infence = maps.map.checkGeofence(lastloc.latitude, lastloc.longitude, fences[i].polygon);
          if (infence === false) {
            count++;
          }
        }
        if (count === fences.length) {
          $scope.inside = false;
        } else {
          $scope.inside = true;
        }
      });
    };

    this.GetUpdatedPath = function(polygon) {
      var polyobj = polygon.latLngs.j[0].j;
      paths = [];
      for(var j = 0; j < polyobj.length; j++) {
        paths.push([polyobj[j].k, polyobj[j].B]);
      }
      return paths;
    };

    this.SaveUpdatedPolygons = function(patientid) {
      for (var i = 0; i < fences.length; i++) {
        var paths = maps.GetUpdatedPath(fences[i].polygon);
        if (fences[i].id === null) {
          Fence.save({id: patientid}, {polygon: paths});
        } else {
          Fence.update({id: patientid, fid: fences[i].id}, {polygon: paths});
        }
      }

      Fence.query({ id: patientid }, function(data) {
        var freeids = [];
        for (var i = 0; i < data.length; i++) {
          var used = false;
          for (var j = 0; j < fences.length; j++) {
            if (fences[j].id === data[i].id) {
              used = true;
            }
          }

          if (used === false) {
            freeids.push(data[i].id);
          }
        }

        freeids.reverse();
        for (var k = 0; k < fences.length; k++) {
          if (fences[k].id === null) {
            fences[k].id = freeids.pop();
          }
        }
      });

      maps.CheckPatientInBounds(patientid);
    };

    this.AddFences = function(patientid) {
      Fence.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          fences[i] = {
            id: data[i].id,
            polygon: maps.CreatePolygon(data[i].polygon)
          };
        }
      });
    };

    this.AddMostRecentMarker = function(patientid) {
      Location.query({ id: patientid }, function(data) {
        maps.CreateMarker(data[data.length-1]);
        maps.map.setCenter(data[data.length-1].latitude, data[data.length-1].longitude);
      });
    };

    this.AddMarkersInRange = function(patientid, start, end) {
      Location.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data.timestamp > Number(start) && data.timestamp < Number(end)) {
            maps.CreateMarker(data[i]);
          }
        }
      });
    };

    this.ClearMarkers = function() {
      maps.map.removeMarkers();
      markersOutOfBounds = [];
    };

    this.ClearPolygons = function() {
      for (var i = 0; i < fences.length; i++) {
        fences[i].polygon.setMap(null);
      }
      fences = [];
    };

    this.EnableFenceMaking = function() {
      maps.map.setContextMenu({
        control: 'map',
        options: [{
          title: 'Create fence',
          name: 'create_fence',
          action: function(e) {
            var lat = e.latLng.lat(),
                lng = e.latLng.lng();
            var path = [[lat, lng], [lat+0.0015, lng-0.003], [lat-0.003, lng+0.0015]];
            fences[fences.length] = {
              id: null,
              polygon: maps.CreatePolygon(path)
            };
          }
        }]
      });

    };

    this.RevertFenceChanges = function(patientid) {
      maps.ClearPolygons();
      maps.AddFences(patientid);
    };

    this.CurrentLocation = function(patientid) {
      maps.ClearMarkers();
      maps.AddMostRecentMarker(patientid);
      showAll = false;
    };

    this.LocationsBetweenDates = function(patientid, startdate, enddate) {
      maps.ClearMarkers();
      maps.AddMarkersInRange(patientid, Date(startdate), Date(enddate));
    };

    this.ShowAll = function(patientid) {
      maps.ClearMarkers();
      Location.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          maps.CreateMarker(data[i]);
        }
        maps.map.setCenter(data[data.length-1].latitude, data[data.length-1].longitude);
      });
      showAll = true;
    };

    this.init = function(patientid) {
      if (maps.map === undefined) {
        maps.CreateMap(maps.mapSettings);
      } else {
        maps.ClearMarkers();
        maps.ClearPolygons();
      }

      maps.AddFences(patientid);

      if (showAll) {
        maps.ShowAll(patientid);
      } else {
        maps.CurrentLocation(patientid);
      }
      maps.EnableFenceMaking();
      maps.CheckPatientInBounds(patientid);
    };

    $scope.$watch('patient.id', function(newid, oldid) {
      if (newid !== undefined) {
        if (maps.map !== undefined) {
          maps.init(newid);
        }
      }
    });

    $scope.$watch(function() { return Session.currentTab; },
        function(tab) {
          if (!Session.mapLoaded && tab == "locations") {
            maps.init(Session.currentPatient.id);
            Session.mapLoaded = true;
          }
    });

  });


})();
