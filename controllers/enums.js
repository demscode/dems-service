(function (exports) {
  'use strict';

  var enums = require('../dems.enums.json');

  var reverseEnums = {};

  for(var enumName in enums) {
    if(enums.hasOwnProperty(enumName)) {
      reverseEnums[enumName] = {};
      var theEnum = enums[enumName];
      var theReverseEnum = reverseEnums[enumName];
      for(var index in theEnum) {
        if(theEnum.hasOwnProperty(index)) {
          theReverseEnum[theEnum[index]] = index;
        }
      }
    }
  }

  exports.getEnum = function(enumName) {
    return enums[enumName];
  };

  exports.getReverseEnum = function(enumName) {
    return reverseEnums[enumName];
  };

})(exports);