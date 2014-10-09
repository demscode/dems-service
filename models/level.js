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

    var Level = schemaMongo.define('Level', {
      id: { type: Number },
      name: { type: String }
    });

    return Level;
  };

})(exports);
