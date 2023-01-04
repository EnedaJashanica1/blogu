const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    password: String,
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    image: String,
    blogs: [{
        type: mongoose.Types.ObjectId,
        ref: 'Blog'
    }]

});
module.exports = mongoose.model('User', userSchema);