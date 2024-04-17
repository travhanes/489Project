var express = require('express');
const User = require('../models/User');
const Publisher = require('../models/Publisher');
const Product = require('../models/Product');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/cart', function(req, res, next) {
  res.redirect('/')
}) 

router.get('/product.ejs', function(req, res, next) {
  res.redirect('product/0');
});

router.get('/product/:productid', async function(req, res, next) {
  const product = await Product.findProduct(parseInt(req.params.productid));
  const publisher = await Publisher.findPublisher(product.publisherid);
  res.render('store/product', { product, publisher });
});

router.get('/:page', function(req, res, next) {
  res.render('store/' + req.params.page);
});

router.post('/addToWishlist', async function(req, res, next) {
  try {
    res.redirect('/store?msg=success')
  } catch (error) {
    res.redirect('/store?msg=failure')
  }
})

module.exports = router;
