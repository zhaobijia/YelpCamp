const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RevivewSchema = new Schema({
    body: String,
    rating: Number
});

const Review = mongoose.model('Review', RevivewSchema);
module.exports = Review;