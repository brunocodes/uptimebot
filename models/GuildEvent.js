const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventsSchecma = new Schema({
  user_id: Schema.Types.ObjectId,
  guild_id: String,
  name: String,
  url: String,
  interval: Number,
  channel: String,    
  channel_name: String,
  role: String,
  role_name: String,
  message: String,
  timeout: Number,
  active: Boolean,
  timezone: String,  
  status: {
    type: String,
    default: "OPERATIONAL",
    enum: ["OPERATIONAL", "DEGRADED", "OUTAGE", "PAUSE"]
  }  
});

module.exports = GuildEvent = mongoose.model('GuildEvent', EventsSchecma);