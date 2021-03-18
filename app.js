const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema } = require('./schemas.js');


const Campground = require('./models/campground');
const Review = require('./models/review');


//mongoose connect mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopolo: true,
    useFindAndModify: false
})
//from https://mongoosejs.com/docs/
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Database connected");
});


app.engine('ejs', ejsMate);


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    //try to validate before we save to mangoose

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

}))


app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {

    //we need express to parse req.body here, otherwise it will be empty
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

// review Route
app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
//error handler
app.use((err, req, res, next) => {
    //destructure & set the default
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'default error message';
    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})