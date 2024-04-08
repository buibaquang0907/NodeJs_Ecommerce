var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var ResHelper = require('../helper/ResponseHandle');
var Validator = require('../validators/user');
const { validationResult } = require('express-validator');
var bcrypt = require('bcrypt');
const protect = require('../middleware/protect');
const sendmail =require('../helper/sendmail')

router.get('/me', protect, async function (req, res, next) {
  ResHelper.ResponseSend(res, true, 200, req.user)
});

function validateEmail(email) {
  // Simple regex for email validation; adjust as needed for your requirements
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

router.post('/ForgotPassword', async function (req, res, next) {
  if (!validateEmail(req.body.email)) {
    ResHelper.ResponseSend(res, false, 400, "Email không đúng định dạng");
    return;
  }

  try {
    let user = await userModel.findOne({
      email: req.body.email
    });
    if (!user) {
      ResHelper.ResponseSend(res, false, 404, "Email không tồn tại");
      return;
    }
    
    let token = user.genTokenResetPassword(); 
    await user.save();
    
    let url = `http://127.0.0.1:3000/changepassword/${token}`;
    await sendmail(user.email, url); 
    
    ResHelper.ResponseSend(res, true, 200, "Gửi mail thành công");
  } catch (error) {
    console.error(error); 
    ResHelper.ResponseSend(res, false, 500, "Có lỗi xảy ra");
  }
});

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

router.post('/ResetPassword/:token', async function (req, res, next) {
  try {
    console.log(req.params.token);
    let user = await userModel.findOne({
      ResetPasswordToken: req.params.token
    });
    if (!user) {
      ResHelper.ResponseSend(res, false, 404, "URL không đúng");
      return;
    }
    if (user.ResetPasswordExp > Date.now()) {
      if (validatePassword(req.body.password)) {
        user.password = req.body.password; 
      } else {
        ResHelper.ResponseSend(res, false, 400, "Mật khẩu không đủ mạnh");
        return;
      }
    } else {
      ResHelper.ResponseSend(res, false, 400, "Token hết hạn");
      return;
    }
    user.ResetPasswordExp = undefined;
    user.ResetPasswordToken = undefined;
    await user.save();
    ResHelper.ResponseSend(res, true, 200, "Đổi password thành công");
  } catch (error) {
    next(error); 
  }
});

router.post('/logout', async function (req, res, next) {
  res.status(200).cookie('token', "null", {
    expires: new Date(Date.now + 1000),
    httpOnly: true
  }).send("Bạn đã đăng xuất!");
});


router.post('/login', async function (req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    ResHelper.ResponseSend(res, false, 404, 'Email hoặc Mật khẩu không được bỏ trống!');
    return;
  }
  let user = await userModel.findOne({ email: email });
  if (!user) {
    ResHelper.ResponseSend(res, false, 404, 'Email hoặc Mật khẩu không đúng!');
    return;
  }
  var checkpass = bcrypt.compareSync(password, user.password);
  if (checkpass) {
    res.status(200).cookie('token', user.getJWT(), {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
    }).send({
      success: true,
      data: user.getJWT()
    })
  } else {
    ResHelper.ResponseSend(res, false, 404, 'Email hoặc Mật khẩu không đúng!');
  }
});
router.post('/register', Validator.UserValidate(), async function (req, res, next) {
  var errors = validationResult(req).errors;
  if (errors.length > 0) {
    ResHelper.ResponseSend(res, false, 404, errors);
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      address: "unknown",
      role: ['USER']
    })
    await newUser.save();
    ResHelper.ResponseSend(res, true, 200, newUser)
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error)
  }
});

module.exports = router;
