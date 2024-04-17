var express = require('express');
const User = require('../models/User');
const ShoppingCart = require('../models/ShoppingCart')
const Product = require("../models/Product")
const Wishlist = require('../models/Wishlist')

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }

  const products = await Product.findAll();
  res.render('store/index', { products });
});

module.exports = router;
