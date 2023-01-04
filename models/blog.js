const mongoose = require('mongoose');

const blogsSchema = mongoose.Schema({
    title: String,
    text: String,
    date: Date,
    image: String,
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})
module.exports = mongoose.model('Blog', blogsSchema);