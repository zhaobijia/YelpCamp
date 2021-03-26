const express = require('express');
const { reviewSchema, campgroundSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store original url on session
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    //try to validate before we save to mangoose

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isCampAuthor = async (req, res, next) => {
    const { id } = req.params;
    //authorization
    const camp = await Campground.findById(id);
    if (!camp.author || !camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${camp._id}`);

    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}