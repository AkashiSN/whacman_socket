var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;

var PlayerSchema = new Schema({
  name : { type: String, required: true },
  message : String,
  score: Number
});

module.exports = PlayerSchema
