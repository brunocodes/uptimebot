const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventLogSchecma = new Schema({
  user_id: Schema.Types.ObjectId,
  event_id: Schema.Types.ObjectId,
  event_type: {
    type: String,
    enum: ["OPERATIONAL", "DEGRADED", "OUTAGE", "PAUSE", "START"]
  },
  monitor_name: String,  
  res_num: Number,
  res_status: String,
  initial_date: {
		type: Date,
		default: Date.now
  },
  end_date: Date
});

module.exports = EventLog = mongoose.model('EventLog', EventLogSchecma);