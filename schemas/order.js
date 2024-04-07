var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    totalPrice:{
        type: Number,
        require: true
    },
    payment:{
        type: String,
        require: true
    },
    shippingAddress:{
        type: String,
        require: true
    },
    dateOrder:{
        type: Date,
        require: true
    },
    status:{
        type: String,
        require: true
    },
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        require: true
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('order', orderSchema)