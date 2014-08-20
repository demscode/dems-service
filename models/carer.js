var Schema = require('jugglingdb').Schema;
var schema = new Schema('mongodb');

module.exports = schema.define('Carer', {
    id : Number,
    token : String,
    email : String,
    name: String,
});
