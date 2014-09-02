/**
 * Carer Schema and Model
 * Functionality for the Carer persistence.
 */

(function (exports) {
  'use strict';
/*
  var settings = require('../dems.conf.json').db.mongodb;
  var Patient = require('./patient.js').init(settings);*/

  /**
   * Initialises model with given db settings.
   * @param  {object} settings  MongoDB adapter settings
   * @return {object}           JugglingDB model object
   */
  exports.init = function(settings) {
    var Patient = require('./patient.js').init(settings);
    var Schema = require('jugglingdb').Schema;

    var schemaMongo = new Schema('mongodb', settings);

    var Carer = schemaMongo.define('Carer', {
      id :              { type: Number, index: true },
      token :           { type: String },
      email :           { type: String, limit: 150 },
      name:             { type: String, limit: 50 },
      address:          { type: String },
      contact_number:   { type: String }
    });

    Carer.hasMany(Patient, {as: 'patients', foreignKey: 'carer_id'});

    return Carer;
  };

})(exports);
