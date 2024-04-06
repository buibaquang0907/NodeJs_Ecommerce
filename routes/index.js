var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.use('/api/v1/products', require('./products'));
router.use('/api/v1/categorys', require('./categorys'));
router.use('/api/v1/users', require('./users'));
router.use('/api/v1/auth', require('./auth'));
module.exports = router;
