const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require("../models/User.js"); // Ensure you have the correct path

require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.CALLBACK_URL,
    passReqToCallback: true
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log("user profile is: ", profile);
}
));


