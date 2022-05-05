const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    guild_id: String,
    guild_name: String,
    admin: String,
    icon: String,
    register_date: {
        type: Date,
        default: Date.now
    },
    events: [{
        type: Schema.Types.ObjectId, 
        ref: 'GuildEvent'
    }] 
});

module.exports = Guild = mongoose.model('Guild', GuildSchema);