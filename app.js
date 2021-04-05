if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo');

const User = require('./models/user');

const campgroundsRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');

const localDBUrl = 'mongodb://localhost:27017/yelp-camp';
const atlasDBUrl= process.env.DB_URL;


//mongoose connect mongodb
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect(localDBUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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
app.use(mongoSanitize());

//helmet :
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dro7niddl/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store = new MongoDBStore({
    mongoUrl:localDBUrl,
    secret:  'thisshouldbeabettersecret!',
    touchAfter: 24*60*60
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: 'taotao',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


//passport
app.use(passport.initialize());
app.use(passport.session());
//authentication method is going to locate on our user model
passport.use(new LocalStrategy(User.authenticate()));//we can have multiple strategies
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware, set it before routers
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter);



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