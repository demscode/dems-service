/**
 * RESTful API routes used by client apps, serving json.
 */

(function(exports) {
  "use strict";

  /**
   * Intialises declared API routes.
   */
  exports.init = function(app) {

    var Models = require('../models');

    require('./api/patient.js').init(app, Models);
    require('./api/carer.js').init(app, Models);

  }; // end init

})(exports);
