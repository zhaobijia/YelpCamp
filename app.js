const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

//mongoose connect mongodb
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopolo: true,
})
//from https://mongoosejs.com/docs/
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Database connected");
});


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})