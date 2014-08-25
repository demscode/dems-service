/**
 * Models Hub
 * Recommended `require` for busy controllers.
 */

var settings = require('../dems.conf.json');
var mongo = settings.db.mongo;

exports.carer = require('./carer').init(mongo);
