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
    return $resource('/api/patient/:id/fence');
  });

  app.controller('MapsController', function(Location, Fence) {
    var maps = this;
    var map, polygon, marker;

    this.mapSettings =  {
      div: '#map',
      lat: -27.4679,
      lng: 153.0278
    };

    this.CreateMap = function(settings) {
      maps.map = GMaps(settings);
    };

    this.CreatePolygon = function(paths) {
      maps.polygon = maps.map.drawPolygon({
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
        draggable: false,
        fences: [maps.polygon],
        outside: function(marker, fence) {
          console.log("Patient outside of fence.");
        },
        infoWindow: {
          content: Date(position.timestamp)
        }
      });
    };

    this.GetUpdatedPolygon = function() {
      var polyobj = maps.polygon.latLngs.j[0].j;
      var newPath = [];
      for(var i = 0; i < polyobj.length; i++) {
        newPath.push([polyobj[i].k, polyobj[i].B]);
      }

      console.log(newPath);
      return newPath;
    };

    this.init = function(patientid) {
      maps.CreateMap(maps.mapSettings);

      Fence.query({ id: patientid }, function(data) {
        maps.CreatePolygon(data[0].polygon);
      });

      Location.query({ id: patientid }, function(data) {
        maps.CreateMarker(data[data.length-1]);
      });

    };

  });

})();
