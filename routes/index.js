var express = require('express');
const User = require('../models/User');
const ShoppingCart = require('../models/ShoppingCart')
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

router.get('/cart', async function(req, res, next) {

  user = await User.findUser("testuser", "123")
  
  carts = await ShoppingCart.findCart(user.userid)

  products = []
  for (cart of carts) {
    products.push(await Product.findProduct(cart.dataValues.productid));
  }

  res.render('store/cart.ejs', { products })
})

router.get('/cart/delete/:productid', async function(req, res, next) {

  user = await User.findUser("testuser", "123")
  cart = await ShoppingCart.findCartProduct(user.userid, req.params.productid)
  cart.destroy()

  carts = await ShoppingCart.findCart(user.userid)

  products = []
  for (cart of carts) {
    products.push(await Product.findProduct(cart.dataValues.productid));
  }

  res.render('store/cart.ejs', { products })
})

module.exports = router;
