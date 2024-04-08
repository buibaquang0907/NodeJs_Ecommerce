var express = require('express');
var router = express.Router();
var responseReturn = require('../helper/ResponseHandle');
var orderModel = require('../schemas/order');

router.get('/', async function (req, res, next) {
    var queries = {};
    for (const [key, value] of Object.entries(req.query)) {
        if (!arrayExclude.includes(key)) {
            queries[key] = new RegExp(value, 'i');
        }
    }
    var orders = await orderModel.find(queries)
        .populate({ path: 'product', select: '' })
        .populate({ path: 'user', select: '' })
        .exec();
    responseReturn.ResponseSend(res, true, 200, orders)
});

router.get('/:id', async function (req, res, next) {
    try {
        let orders = await orderModel.findByIdAndUpdate({ _id: req.params.id });
        responseReturn.ResponseSend(res, true, 200, orders)
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error)
    }
});

router.get('/user/:userId', async function (req, res, next) {
    try {
        let orders = await orderModel.find({ user: req.params.userId })
            .populate({ path: 'product', select: '' })
            .populate({ path: 'user', select: '' })
            .exec();;
        responseReturn.ResponseSend(res, true, 200, orders)
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error)
    }
});

router.post('/', async function (req, res, next) {
    try {
        var newOrders = new orderModel({
            totalPrice: req.body.totalPrice,
            payment: req.body.payment,
            shippingAddress: req.body.shippingAddress,
            dateOrder: req.body.dateOrder,
            status: req.body.status,
            product: req.body.product,
            user: req.body.user
        })
        await newOrders.save();
        responseReturn.ResponseSend(res, true, 200, newOrders)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        let orders = await orderModel.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true
            });
        responseReturn.ResponseSend(res, true, 200, orders)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        let orders = await orderModel.findByIdAndUpdate(req.params.id, {
            isDelete: true
        }, {
            new: true
        });
        responseReturn.ResponseSend(res, true, 200, orders)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})



module.exports = router;