const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../middleware/auth.js");

router.route("/signup")
    .get(userController.signupForm)
    .post(userController.signup);
    

router.route("/login")
    .get(userController.loginForm)
    .post(passport.authenticate("local", { 
        failureFlash: true, 
        failureRedirect: "/login" 
    }), userController.login);


router.get("/logout", userController.logout);


router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        // Successful authentication, redirect to notes page
        res.redirect('/lists');
    }
);

module.exports = router;
