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

router.post('/cart/add/:productid', async function(req, res, next) {
  try {
    user = await User.findUser("testuser", "123")

    await ShoppingCart.create({
      userid: user.userid,
      productid: req.params.productid,
      quantity: 1,
      dateAdded: new Date('2024-04-17')
    })

    carts = await ShoppingCart.findCart(user.userid)
  
    products = []
    for (cart of carts) {
      products.push(await Product.findProduct(cart.dataValues.productid));
    }

    res.render('store/cart.ejs', { products })
  } catch (error) {
    console.log("ADD TO SHOPPING CART ERROR: ", error);
    res.redirect('/store/product/' + req.params.productid)
  }
})

router.post('/account/wishlist/add/:productid', async function(req, res, next) {
  console.log("HELLO");

  user = await User.findUser("testuser", "123")
  
  try {
    await Wishlist.create({
      userid: user.userid,
      productid: req.params.productid,
      dateAdded: new Date('2024-04-17')
    })

    wishes = await Wishlist.findWishlist(user.userid)

    products = []
    for (wish of wishes) {
      products.push(await Product.findProduct(wish.dataValues.productid));
    }

  res.redirect('/account/wishlist.ejs');
  }
  catch (error) {
    console.log('ERROR: Product already in wishlist!');
    console.log(error);
    res.redirect('/store/product/' + req.params.productid)
  }
});

module.exports = router;
