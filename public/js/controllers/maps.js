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

  app.controller('MapsController', function(Location, Fence) {
    var maps = this;
    var map, marker;
    var fences = [];

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


    this.CreateMarker = function(position) {
      maps.marker = maps.map.addMarker({
        lat: position.latitude,
        lng: position.longitude,
        draggable: true,
        fences: maps.map.polygons,
        outside: function(marker, fence) {
          console.log("Patient outside of fence.");
        },
        infoWindow: {
          content: Date(position.timestamp)
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

    this.init = function(patientid) {
      if (maps.map === undefined) {
        maps.CreateMap(maps.mapSettings);
      }

      maps.AddFences(patientid);

      maps.AddMostRecentMarker(patientid);
      maps.EnableFenceMaking();
    };

  });

})();
