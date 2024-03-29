var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.use('/api/v1/products', require('./products'));
router.use('/api/v1/categorys', require('./categorys'));
router.use('/api/v1/users', require('./users'));


module.exports = router;
