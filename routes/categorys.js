var express = require('express');
var router = express.Router();
var responseReturn = require('../helper/ResponseHandle');
const category = require('../schemas/category');
var categoryModel = require('../schemas/category');

router.get('/', async function (req, res, next) {
    let limit = parseInt(req.query.limit) || 10; // Sets default page size to 10
    let page = parseInt(req.query.page) || 1;    // Sets default to the first page
    let skip = (page - 1) * limit;

    try {
        var total = await categoryModel.countDocuments();  // Count the total documents
        var categories = await categoryModel.find({isDelete:false}).skip(skip).limit(limit).exec();
        responseReturn.ResponseSend(res, true, 200, { total: total, categories: categories });
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let category = await categoryModel.findById({ _id: req.params.id });
        responseReturn.ResponseSend(res, true, 200, category)
    } catch (error) {
        responseReturn.ResponseSend(res, false, 404, error)
    }
});

router.post('/', async function (req, res, next) {
    try {
        var newCategory = new categoryModel({
            name: req.body.name,
            image:req.body.image,
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
