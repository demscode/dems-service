/**
 * DemS.maps
 *
 */


(function() {
	var app = angular.module('DemS.maps', []);

  app.controller('MapsController', ['$http', function($http) {
    var maps = this;
    var path;
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
        paths: maps.path,
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

    this.init = function(patientid) {
      maps.CreateMap(maps.mapSettings);

      $http.get('/api/patient/' + patientid + '/fence').success(function(data) {
        maps.path = data[0].polygon;
        maps.CreatePolygon(maps.path);
      });

      $http.get('/api/patient/' + patientid + '/locations').success(function(data) {
        maps.locations = data;
        maps.CreateMarker(maps.locations[0]);
      });

    };

  }]);

})();
