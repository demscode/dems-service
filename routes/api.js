/**
 * RESTful API routes used by client apps, serving json.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared API routes.
   */
  exports.init = function(app, geolib, sendMail, enums) {

    var Models = require('../models');

    require('./api/patient.js').init(app, geolib, sendMail, Models, enums);
    require('./api/carer.js').init(app, Models);
    require('./api/enum.js').init(app, enums);

  }; // end init

})(exports);
