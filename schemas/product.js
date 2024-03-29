var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    descripsion: String,
    price: {
        type: Number,
        require: true
    },
    status: String,
    image: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        require: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('product', productSchema)