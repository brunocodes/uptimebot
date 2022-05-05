const passport         = require('passport');
const DiscordStrategy  = require('passport-discord').Strategy;
const DiscordUser      = require('../models/DiscordUser');
require('dotenv').config();

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: "identify email guilds"
  },
  (accessToken, refreshToken, profile, done)=> {
    
    DiscordUser.findOne({ discord_id: profile.id }, (err, user)=> {
        if (err) {
            console.log(err);
            return done(err);
        }
        if (!user) {
            const avatarImage = profile.avatar == null ? "undefined" : profile.avatar ;
            new DiscordUser({
                discord_id: profile.id,
                user_name: profile.username,
                avatar_image_id: avatarImage,
                discriminator: profile.discriminator,
                email: profile.email         
            }).save()
            .then( newUser => {                
                const userModel = {
                    _id: newUser._id,
                    id: profile.id,
                    username: profile.username,
                    avatar: profile.avatar,
                    role: newUser.role,
                    token: profile.accessToken
                }
                return done(null, userModel);
            });
        } else {            
            const userModel2 = {
                _id: user._id,
                id: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                role: user.role,
                token: profile.accessToken
            }
            return done(null, userModel2);
        }
    });    
  }
));
// Passport serializeUser  
passport.serializeUser( (user, done) => {
    done(null, user);
});
// Passport deserializeUser 
passport.deserializeUser( (user, done) => {    
    done(null, user);    
});