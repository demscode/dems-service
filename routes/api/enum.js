/**
 * API route to get enum
 */

(function(exports) {
  'use strict';

  exports.init = function(app, enums) {
    // Enums GET API
    app.get('/api/enum/:enumName', function(req, res) {
      var theEnum = enums.getEnum(req.params.enumName);
      if (theEnum) {
        res.status(200).send(theEnum);
      } else {
        res.status(404).end();
      }
    });
  };
})(exports);