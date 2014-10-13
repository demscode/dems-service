/**
 * Reminder Schema and Model
 * Functionality for the Reminder persistence.
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

    var Reminder = schemaMongo.define('Reminder', {
      name: { type: String },
      time: { type: Number },
      message: { type: String, limit: 200 },
      type: { type: String, limit: 50 },
      createdAt: { type: Number, default: Date.now },
      patient_id: { type: Object },
      acknowledgement: { type: String, default: "none" },
      level: { type: Number, default: 0}
    });

    return Reminder;
  };

})(exports);
