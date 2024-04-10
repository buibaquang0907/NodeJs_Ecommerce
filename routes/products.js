var express = require('express');
var router = express.Router();
var responseReturn = require('../helper/ResponseHandle');
var productModel = require('../schemas/product');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');

router.get('/',async function (req, res, next) {
    var product = await productModel.find({isDelete:false}).exec();
    console.log(product);
    responseReturn.ResponseSend(res, true, 200, product)
});

router.get('/:id', async function (req, res, next) {
    try {
        let product = await productModel.findById({ _id: req.params.id });
        console.log(product);
        responseReturn.ResponseSend(res, true, 200, product)
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error)
    }
});

router.post('/', protect, checkRole("ADMIN"), async function (req, res, next) {
    try {
        var newProduct = new productModel({
            name: req.body.name,
            descripsion: req.body.descripsion,
            price: req.body.price,
            category: req.body.category,
            status: req.body.status,
            image: req.body.image
        })
        await newProduct.save();
        responseReturn.ResponseSend(res, true, 200, newProduct)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.put('/:id', protect, checkRole("ADMIN"), async function (req, res, next) {
    try {
        let product = await productModel.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true
            });
        responseReturn.ResponseSend(res, true, 200, product)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.delete('/:id', protect, checkRole("ADMIN"), async function (req, res, next) {
    try {
        let product = await productModel.findByIdAndUpdate(req.params.id, {
            isDelete: true
        }, {
            new: true
        });
        responseReturn.ResponseSend(res, true, 200, product)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

module.exports = router;