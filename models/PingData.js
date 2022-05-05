const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PingDataSchecma = new Schema({
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
        expires: '30d',
        default: Date.now
    }
});

module.exports = PingData = mongoose.model('PingData', PingDataSchecma);