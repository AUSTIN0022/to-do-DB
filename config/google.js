const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require('../models/User');
const UserService = require('../models/user.service')(User);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        }
        
        user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePhoto: profile.photos[0].value,
            source: 'google'
        });
        
        await user.save();
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
