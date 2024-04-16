var express = require('express');
const User = require('../models/User');
const Product = require("../models/Product")
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
