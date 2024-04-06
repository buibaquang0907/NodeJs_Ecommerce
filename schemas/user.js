var mongoose = require('mongoose');
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken')
var configs = require('../configs/config')
var crypto = require('crypto');
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: String,
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
    role: {
        type: [String],
        default: ["USER"]
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    ResetPasswordToken: String,
    ResetPasswordExp: String
}, { timestamps: true });

userSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
})

userSchema.methods.getJWT = function () {
    var token = jwt.sign({ id: this._id }, configs.SECRET_KEY, {
        expiresIn: configs.EXP_JWT
    });
    return token;
}
userSchema.methods.genTokenResetPassword = function () {
    this.ResetPasswordToken = crypto.randomBytes(30).toString('hex');
    this.ResetPasswordExp = Date.now() + 60 * 1000 * 10;
    return this.ResetPasswordToken;
}
module.exports = new mongoose.model('user', userSchema)