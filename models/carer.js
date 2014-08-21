var Schema = require('jugglingdb').Schema;
var schema = new Schema('mongodb');

module.exports = schema.define('Carer', {
    gid : { type: Number, index: true },
    token : { type: String },
    email : { type: String, limit: 150 },
    name: { type: String, limit: 50 }
});
