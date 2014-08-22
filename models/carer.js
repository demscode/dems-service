/**
 * Carer Schema and Model
 * Functionality for the Carer persistence.
 */

var Schema = require('jugglingdb').Schema;

var schemaMongo = new Schema('mongodb');

module.exports = schemaMongo.define('Carer', {
  id : { type: Number, index: true },
  token : { type: String },
  email : { type: String, limit: 150 },
  name: { type: String, limit: 50 }
});
