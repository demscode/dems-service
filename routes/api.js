/**
 * RESTful API routes used by client apps, serving json.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared API routes.
   */
  exports.init = function(app, geolib, sendMail) {

    var Models = require('../models');
    var enums = require('../dems.enums.json');

    require('./api/patient.js').init(app, geolib, sendMail, Models);
    require('./api/carer.js').init(app, Models);
    require('./api/enum.js').init(app, enums);

  }; // end init

})(exports);
