/**
 * Patient Schema and Model
 * Functionality for the Patient persistence.
 */

(function (exports) {
  'use strict';

  /**
   * Initialises model with given db settings.
   * @param  {object} settings  MongoDB adapter settings
   * @return {object}           JugglingDB model object
   */
  exports.init = function(settings) {
    var Schema = require('jugglingdb').Schema;
    var schemaMongo = new Schema('mongodb', settings);

    var Patient = schemaMongo.define('Patient', {
      id : { type: Number, index: true },
      token : { type: String },
      email : { type: String, limit: 150 },
      name: { type: String, limit: 50 }
    });

    var Location = schemaMongo.define('Location', {
      longitude: { type: Number },
      latitude: { type: Number },
      timestamp: { type: Number, default: Date.now },
      patient_id: { type: Number }
    });

    var Fence = schemaMongo.define('Fence', {
      // array of objects: {longitude: Number, latitude: Number}
      // as given by google maps and consumed by geolib
      polygon: { type: Object, default: [] },
      patient_id: { type: Number }
    });

    // Model Relationships
    Patient.hasMany(Location, {as: 'locations', foreignKey: 'patient_id'});
    Patient.hasMany(Fence, {as: 'fences', foreignKey: 'patient_id'});

    return Patient;
  };

})(exports);