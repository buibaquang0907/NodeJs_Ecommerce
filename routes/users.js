var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var ResHelper = require('../helper/ResponseHandle');
var Validator = require('../validators/user');
const { validationResult } = require('express-validator');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');

router.get('/', protect, checkRole("admin"),
  async function (req, res, next) {
    let users = await userModel.find({}).exec();
    ResHelper.ResponseSend(res, true, 200, users)
  });

router.get('/:id', protect, async function (req, res, next) {
  try {
    let user = await userModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, 200, user)
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error)
  }
});

router.post('/', Validator.UserValidate(), async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResHelper.ResponseSend(res, false, 400, errors.array());
    }

    const newUser = new userModel({
        username: req.body.username,
        password: req.body.password,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        image: req.body.image,
        role: ['USER']
    }); 

    await newUser.save();
    return ResHelper.ResponseSend(res, true, 200, newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return ResHelper.ResponseSend(res, false, 500, "Có lỗi xảy ra!");
  }
});


router.put('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findById
      (req.params.id).exec()
    user.email = req.body.email;
    await user.save()
    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error)
  }
});


router.delete('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate
      (req.params.id, {
        status: false
      }, {
        new: true
      }).exec()
    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error)
  }
});
router.post('/forgotpassword', async function(req, res, next) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return ResHelper.ResponseSend(res, false, 404, "User not found");
    }

    const token = user.genTokenResetPassword();
    await user.save();

    // Send reset password link to the user's email
    const resetLink = `${req.protocol}://${req.get('host')}/resetpassword/${token}`;
    await sendMail(user.email, resetLink);

    ResHelper.ResponseSend(res, true, 200, "Kiểm tra email của bạn để reset");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, "Có lỗi xảy ra");
  }
});

router.post('/resetpassword', async function(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    const user = await userModel.findOne({ ResetPasswordToken: token });

    if (!user || user.ResetPasswordExp < Date.now()) {
      return ResHelper.ResponseSend(res, false, 400, "Có lỗi xảy ra");
    }

    // Reset password
    user.password = newPassword;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordExp = undefined;
    await user.save();

    ResHelper.ResponseSend(res, true, 200, "Thay đổi mật khẩu thành công");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, "Có lỗi xảy ra");
  }
});

router.put('/changepassword', protect, async function(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    // Check if old password matches
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return ResHelper.ResponseSend(res, false, 400, "Old password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    ResHelper.ResponseSend(res, true, 200, "Thay đổi mật khẩu thành công");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, "Có lỗi xảy ra");
  }
});
module.exports = router;