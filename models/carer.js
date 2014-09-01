/**
 * Carer Schema and Model
 * Functionality for the Carer persistence.
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

    return schemaMongo.define('Carer', {
      id :              { type: Number, index: true },
      token :           { type: String },
      email :           { type: String, limit: 150 },
      name:             { type: String, limit: 50 },
      address:          { type: String },
      contact_number:   { type: String }
    });
  };

})(exports);