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
        console.log(fences[i]);
        var paths = maps.GetUpdatedPath(fences[i].polygon);
        Fence.update({ id: patientid, fid: fences[i].id }, {polygon: paths});
      }
    };

    this.AddFences = function(patientid) {
      Fence.query({ id: patientid }, function(data) {
        for (var i = 0; i < data.length; i++) {
          fences[i] = {
            id: data[i].id,
            polygon: maps.CreatePolygon(data[i].polygon)
          };
        }
        console.log(fences);
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

    this.init = function(patientid) {
      maps.CreateMap(maps.mapSettings);

      maps.AddFences(patientid);

      maps.AddMostRecentMarker(patientid);
    };

  });

})();
