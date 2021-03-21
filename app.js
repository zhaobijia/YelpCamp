const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const campgroundsRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');


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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
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