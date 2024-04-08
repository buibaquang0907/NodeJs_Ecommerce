var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var ResHelper = require('../helper/ResponseHandle');
var Validator = require('../validators/user');
const { validationResult } = require('express-validator');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');
// Ví dụ về router cho Node.js sử dụng Express và Mongoose
router.get('/', protect, checkRole("admin"), async function (req, res, next) {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
      const users = await userModel.find({isDelete:false}).skip(skip).limit(limit).exec();
      const total = await userModel.countDocuments({isDelete:false});
      console.log(users);
      ResHelper.ResponseSend(res, true, 200, { users, total });
  } catch (error) {
      ResHelper.ResponseSend(res, false, 500, { message: "An error occurred" });
  }
});

router.get('/:id', protect, checkRole("admin"), async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id).exec();
    // Ensure ResHelper.ResponseSend is the correct method
    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    // Make sure to handle the error appropriately
    ResHelper.ResponseSend(res, false, 404, error.message);
  }
});


router.post('/',protect, checkRole("admin"), Validator.UserValidate(), async function (req, res, next) {
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


router.put('/:id',protect, checkRole("admin"), async function (req, res, next) {
  try {
    let user = await userModel.findById
      (req.params.id).exec()
      user.email = req.body.email;
      user.username = req.body.username,
      user.password = req.body.password,
      user.address = req.body.address,
      user.phone = req.body.phone,
      user.image = req.body.image,
      await user.save()
    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error)
  }
});

router.delete('/:id',protect, checkRole("admin"), async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isDelete: true }, // Make sure this field name matches your schema
      { new: true }
    ).exec();

    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error);
  }
});

module.exports = router;