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

    return schemaMongo.define('Patient', {
      id : { type: Number, index: true },
      token : { type: String },
      email : { type: String, limit: 150 },
      name: { type: String, limit: 50 },
      pos_latitude: { type: Number},
      pos_longitude: { type: Number},
      fence_latitude: { type: Number},
      fence_longitude: { type: Number},
      fence_radius: { type: Number},
    });
  };

})(exports);