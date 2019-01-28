const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const RepairSchema = new Schema({
    userid: {type:String, required: true},
    repairsdate: {type:Date, required: true},
    repaircomment: {type:String, required: true},
    repairfdate: {type:String, required: true},
    repairtech: {type:String, required: true},
});

RepairSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('repairs', RepairSchema, 'repairs');
