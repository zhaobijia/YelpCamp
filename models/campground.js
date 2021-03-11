const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shortcut for mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;