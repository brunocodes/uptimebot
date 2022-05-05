const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PingDataProSchecma = new Schema({
    event_id: Schema.Types.ObjectId,    
    res_time: Number,
    status: String,
    res_num: Number,
    date: {
        type: Date,
        default: Date.now
    },
    expireAt: {
        type: Date,
        expires: '90d',
        default: Date.now
    }
});

module.exports = PingDataPro = mongoose.model('PingDataPro', PingDataProSchecma);