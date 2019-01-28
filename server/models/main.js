const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const MainSchema = new Schema({
    userid: {type:String},
    ticketid:{type: String},
    maindate: {type:Date},
    maintool: {type:String},
    maindesc: {type:String},
    maintech: {type:String},
    rsdate: {type:Date},
    rcom: {type:String},
    fixdate: {type:Date},
    waitingtime: {type: String}
    
});

MainSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('mains', MainSchema, 'mains');
