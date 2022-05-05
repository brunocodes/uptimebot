const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const DiscordUserSchema = new Schema({
    discord_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    avatar_image_id: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "FREE",
        enum: ["FREE", "PRO", "ADMIN", "TESTER"]
    },
    register_date: {
		type: Date,
		default: Date.now
    }    
});

module.exports = DiscordUser = mongoose.model('DiscordUser', DiscordUserSchema);