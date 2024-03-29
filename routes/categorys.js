var express = require('express');
var router = express.Router();
var responseReturn = require('../helper/ResponseHandle');
const category = require('../schemas/category');
var categoryModel = require('../schemas/category');

router.get('/', async function (req, res, next) {
    var category = await categoryModel.find({}).exec();
    responseReturn.ResponseSend(res, true, 200, category)
});

router.get('/:id', async function (req, res, next) {
    try {
        let category = await categoryModel.find({ _id: req.params.id });
        responseReturn.ResponseSend(res, true, 200, category)
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error)
    }
});

router.post('/', async function (req, res, next) {
    try {
        var newCategory = new categoryModel({
            name: req.body.name,
            image:req.body.image
        })
        await newCategory.save();
        responseReturn.ResponseSend(res, true, 200, newCategory)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.put('/:id', async function (req, res, next) {
    try {
        let category = await categoryModel.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true
            });
        responseReturn.ResponseSend(res, true, 200, category)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

router.delete('/:id', async function (req, res, next) {
    try {
        let category = await categoryModel.findByIdAndUpdate(req.params.id, {
            isDelete: true
        }, {
            new: true
        });
        responseReturn.ResponseSend(res, true, 200, category)
    } catch (error) {
        responseReturn.ResponseSend(res, true, 404, error)
    }
})

module.exports = router;
