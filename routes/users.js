var express = require('express');
var router = express.Router();
var responseReturn = require('../helper/ResponseHandle');
const user = require('../schemas/user');
var userModel = require('../schemas/user');

router.get('/', async function (req, res, next) {
    var user = await userModel.find({}).exec();
    responseReturn.ResponseSend(res, true, 200, user)
});

router.get('/:id', async function (req, res, next) {
    try {
        let user = await userModel.find({ _id: req.params.id });
        responseReturn.ResponseSend(res, true, 200, user)
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error)
    }
});

router.post('/', async function (req, res, next) {
    try {
        var newUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            phone:req.body.phone,
            image:req.body.image,
            address:req.body.address
        })
        await newUser.save();
        responseReturn.ResponseSend(res, true, 200, newUser)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        let user = await userModel.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true
            });
        responseReturn.ResponseSend(res, true, 200, user)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        let user = await userModel.findByIdAndUpdate(req.params.id, {
            isDelete: true
        }, {
            new: true
        });
        responseReturn.ResponseSend(res, true, 200, user)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

module.exports = router;
