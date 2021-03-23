const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

//do i need a joi schema to check user?
//register
router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    res.send(req.body);
}))
//login
router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', catchAsync(async (req, res) => {
    res.send(req.body);
}))

//logout

module.exports = router;