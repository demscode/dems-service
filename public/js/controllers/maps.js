/**
 * DemS.maps
 *
 */
(function() {
  var app = angular.module('DemS.maps', ['google-maps']);

  app.controller('MapsController', function($scope) {
    $scope.map = {
      center: {
        latitude: -27.4679,
        longitude: 153.0278
      },
      zoom: 14
    };

    $scope.marker = {
      id: 0,
      title: "QUT - Gardens Point",
      coords: {
        latitude: -27.477112,
        longitude: 153.028015
      },
      options: {
        draggable: false
      }
    };

  });

})();
