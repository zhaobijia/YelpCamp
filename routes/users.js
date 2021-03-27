const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const usersController = require('../controllers/users');

//do i need a joi schema to check user?
//register
router.get('/register', usersController.registerForm);

router.post('/register', catchAsync(usersController.registerUser));
//login
router.get('/login', usersController.loginForm);
//use passport middleware that we pass strategy
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(usersController.loginUser));

//logout
router.get('/logout', usersController.logoutUser);

module.exports = router;