const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email cannot be blank'],
        unique: true
    }
});
//add on to our schema a username, hash and salt field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);