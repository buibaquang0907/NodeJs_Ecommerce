var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    phone: {
        type: String,
        unique: true,
        require: true
    },
    image: String,
    address: String,
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('user', userSchema)