const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const passport = require('passport');

//do i need a joi schema to check user?
//register
router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)

        //auto login after register, this function needs an error callback
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome! ${registeredUser.username}`);
            res.redirect('/campgrounds');
        });


    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}))
//login
router.get('/login', (req, res) => {
    res.render('users/login');
})
//use passport middleware that we pass strategy
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome! ${username}`);
    const original = req.session.returnTo;
    if (original) {
        delete req.session.returnTo;
        res.redirect(original);
    } else {
        res.redirect('/campgrounds');
    }
}))

//logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
})

module.exports = router;