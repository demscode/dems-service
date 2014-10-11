(function () {
    angular.module('DemS').factory("Enum", function($resource) {
      var resource = $resource('/api/enum/:enumName', {}, {
        get: {method:'GET'}
      });

      var get = function (enumName, callback) {
        resource.get({enumName: enumName}, function (theEnum) {
          var formattedEnum = {};
          for(var index in theEnum) {
            if(theEnum.hasOwnProperty(index) && !isNaN(parseInt(index))) {
              formattedEnum[index] = theEnum[index];
            }
          }
          callback(formattedEnum);
        });
      };

      return {
        get: get
      };
    });
})();