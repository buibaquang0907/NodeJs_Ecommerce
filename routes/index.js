var express = require('express');
var router = express.Router();

router.use('/api/v1/products', require('./products'));
router.use('/api/v1/categorys', require('./categorys'));
router.use('/api/v1/users', require('./users'));
router.use('/api/v1/auth', require('./auth'));
router.use('/api/v1/orders', require('./orders'));

module.exports = router;
