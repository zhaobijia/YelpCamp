const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shortcut for mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;