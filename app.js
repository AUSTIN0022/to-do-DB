// app.js

const express = require("express");
const app = express();
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const User = require("./models/User");
const date = require('date-and-time')

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_DB_URL || "mongodb://127.0.0.1:27017/to-do-DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session and flash setup
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions));
app.use(flash());

require("./config/passport.js");
require("./config/google.js");


// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
const authRoutes = require("./routes/auth");
const listRoutes = require("./routes/lists");
const todoRoutes = require("./routes/todos");

app.use("/", authRoutes);
app.use("/lists", listRoutes);
app.use("/todos", todoRoutes);

// Home route
app.get('/home', (req, res) => {
    res.render('home', { 
        title: 'Welcome to Your To-Do App',
        currentUser: req.user 
    });
});

// settings route
// settings route
app.get('/settings', async (req, res) => {
    try {
        let userInfo = await User.findById(req.user._id);
        res.render('settings', { userInfo });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).render('error', { error: 'Failed to load user information' });
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
app.post('/settings', ensureAuthenticated, async (req, res) => {
    try {
        const { username, firstName, lastName, darkMode, emailNotifications } = req.body;
        
        await User.findByIdAndUpdate(req.user._id, {
            username,
            firstName,
            lastName,
            darkMode: !!darkMode,
            emailNotifications: !!emailNotifications
        });

        req.flash('success', 'Settings updated successfully');
        res.redirect('/settings');
    } catch (error) {
        console.error('Error updating user settings:', error);
        req.flash('error', 'Failed to update settings');
        res.redirect('/settings');
    }
});

// Root route redirect
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
