const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    googleId: String,
    email: { type: String, required: true, unique: true },
    username: String,
    firstName: String,
    lastName: String,
    profilePhoto: {type: String, default: '/img/default.jpeg'},
    source: {
        type: String,
        required: true,
        enum: ['local', 'google']
    },
    darkMode: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);