const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundsController = require('../controllers/campgrounds');
const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');



router.get('/', catchAsync(campgroundsController.index));

//create campground form
router.get('/new', isLoggedIn, catchAsync(campgroundsController.newForm));

router.get('/:id', catchAsync(campgroundsController.showCamp));
//edit form
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(campgroundsController.editForm));

router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsController.createCamp));

router.put('/:id', isLoggedIn, validateCampground, isCampAuthor, catchAsync(campgroundsController.editCamp));

router.delete('/:id', isLoggedIn, isCampAuthor, catchAsync(campgroundsController.deleteCamp));



module.exports = router;