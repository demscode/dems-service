/**
 * Routes module, configuring route files for Express.
 */

(function(exports) {
  "use strict";

  /**
   * Aggregation of declared routes used by Express.
   */
  exports.init = function(app, passport, geolib, sendMail) {

    var routesApi = require('./api.js');
    var routesWebClient = require('./webclient.js');
    var routesAuth = require('./auth.js');

    routesApi.init(app, geolib, sendMail);
    routesWebClient.init(app);
    routesAuth.init(app, passport);

  }; // end init

})(exports);
