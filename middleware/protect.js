var ResHelper = require('../helper/ResponseHandle');
var jwt = require('jsonwebtoken');
var configs = require('../configs/config')
var userModel = require('../schemas/user')

module.exports = async function (req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        if (req.cookies.token) {
            token = req.cookies.token;
            //console.log(token);
        }
    }
    if (!token) {
        ResHelper.ResponseSend(res, false, 404, "Vui lòng đăng nhập!")
        return;
    }
    try {
        let result = jwt.verify(token, configs.SECRET_KEY);
        if (result.exp * 1000 > Date.now()) {
            let user = await userModel.findById(result.id);
            //console.log(user.username);
            req.user = user;
            next();
        } else {
            ResHelper.ResponseSend(res, false, 404, "Vui lòng đăng nhập!")
        }
    } catch (error) {
        ResHelper.ResponseSend(res, false, 404, "Vui lòng đăng nhập!")
    }
}