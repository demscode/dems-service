(function() {
  'use strict';

  angular.module('DemS').factory('Heatmap', [
    '$resource',
    'Location',
  function($resource, Location) {
    var heatmap;

    function setHeatmap(patientid, map) {
      // avoid multiple heatmaps
      removeHeatmap();

      Location.query({ id: patientid }, function(data) {
        var heatmapData = [];
        for (var i = 0; i < data.length; i++) {
          heatmapData.push(new google.maps.LatLng(data[i].latitude, data[i].longitude));
        }

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          radius: 20
        });

        heatmap.setMap(map);
      });
    }

    function removeHeatmap() {
      if (heatmap) {
        heatmap.setMap(null);
        heatmap = null;
      }
    }

    return {
      setHeatmap: setHeatmap,
      removeHeatmap: removeHeatmap
    };
  }
  ]);
})();