const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        }
        
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            user.googleId = profile.id;
            user.source = 'google';
            await user.save();
            return done(null, user);
        }
        
        const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePhoto: profile.photos[0].value,
            source: 'google'
        });
        await newUser.save();
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));
