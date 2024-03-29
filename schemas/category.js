var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: String,
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


categorySchema.virtual('published',{
    ref:"product",
    localField:'_id',
    foreignField:'category'
})
categorySchema.set('toJSON',{virtuals:true})
categorySchema.set('toObject',{virtuals:true})

module.exports = new mongoose.model('category', categorySchema)