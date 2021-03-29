const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundsController = require('../controllers/campgrounds');
const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');
const multer = require('multer')
const { storage } = require('../cloudinary');//node automatically look for index
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgroundsController.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgroundsController.createCamp));
    .post(upload.array('campground[image]'), (req, res) => {
        console.log(req.body, req.files);
        res.send("worked?");
    })

//create campground form
router.get('/new', isLoggedIn, catchAsync(campgroundsController.newForm));

router.route('/:id')
    .get(catchAsync(campgroundsController.showCamp))
    .put(isLoggedIn, validateCampground, isCampAuthor, catchAsync(campgroundsController.editCamp))
    .delete(isLoggedIn, isCampAuthor, catchAsync(campgroundsController.deleteCamp));

//edit form
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(campgroundsController.editForm));


module.exports = router;