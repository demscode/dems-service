/**
 * Activity Schema and Model
 * Functionality for the Activity persistence.
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

    var Activity = schemaMongo.define('Activity', {
      time: { type: Number, default: Date.now },
      type: { type: Number },
      description: { type: String },
      patient_id: { type: Object }
    });

    return Activity;
  };

})(exports);
