// GET /login - Display login form
//    - POST /login - Process login
//    - GET /register - Display registration form
//    - POST /register - Process registration
//    - GET /logout - Log out user


const User = require("../models/User");

module.exports.signupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Sign up succuessfull!");
            res.redirect("/home");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "Logged in!");
    const redirectUrl = req.session.returnTo || "/lists";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out!");
        res.redirect("/home");
    });
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.googleAuth = (req, res) => {
    const isNewUser = req.user.createdAt && 
                      (new Date() - req.user.createdAt) / 1000 < 10;
    
    if (isNewUser) {
      req.flash("success", "Welcome! Your account has been created with Google.");
    } else {
      req.flash("success", "Logged in with Google!");
    }
    
    const redirectUrl = req.session.returnTo || "/lists";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  };