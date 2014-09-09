/**
 * Models Hub
 * Recommended `require` for busy controllers.
 */

(function (exports) {
  'use strict';

  var mongo = {};
  if (process.env.MONGOHQ_URL) {
    mongo.url = process.env.MONGOHQ_URL;
  } else {
    mongo = require('../dems.conf.json').db.mongo;
  }

  exports.carer = require('./carer').init(mongo);
  exports.patient = require('./patient').init(mongo);

})(exports);
