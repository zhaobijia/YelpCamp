const express = require('express');
const router = express.Router({ mergeParams: true });//if not set mergeparams req.params will be empty
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewController = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// review Route
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;