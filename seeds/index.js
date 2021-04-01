//connect to mongoose and contain the model
//run this file on its own any time we want to seed our database.
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');

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

//function for random selecting descriptors and placs
const randSample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const RandIndex = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${randSample(descriptors)} ${randSample(places)}`,
            price: Math.floor(Math.random() * 20) + 10,
            description: "description description description",
            location: `${cities[RandIndex].city},  ${cities[RandIndex].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[RandIndex].longitude, cities[RandIndex].latitude]
            },
            author: '60594bf632a02d7a1040cd67',
            images: [
                {
                    url: 'https://res.cloudinary.com/dro7niddl/image/upload/v1617055104/YelpCamp/a8sbj1nfo1ouufecuooo.jpg',
                    filename: 'YelpCamp/a8sbj1nfo1ouufecuooo'
                },
                {
                    url: 'https://res.cloudinary.com/dro7niddl/image/upload/v1617055104/YelpCamp/vtxpdbsyzb9ojjgsnu4e.jpg',
                    filename: 'YelpCamp/vtxpdbsyzb9ojjgsnu4e'
                }
            ]


        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})