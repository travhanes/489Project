var express = require('express');
const User = require('../models/User');
const Publisher = require('../models/Publisher');
const Product = require('../models/Product');
const ShoppingCart = require('../models/ShoppingCart');
const Order = require('../models/Order')
var router = express.Router();

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/orderComplete/:userid', async function(req, res, next) {
  console.log("ORDER COMPLETE PAGE OPENED");

  await Order.create({
    orderid: getRandomArbitrary(1000, 9999),
    userid: req.params.userid,
    status: 'Ordered',
    dateOrdered: Date('2024-05-20'),
    dateDelivered: null,
    paymentOption: 1111
  })

  res.render('store/orderComplete.ejs', {})
})

router.get('/product.ejs', function(req, res, next) {
  res.redirect('product/0');
});

router.get('/product/:productid', async function(req, res, next) {
  const product = await Product.findProduct(parseInt(req.params.productid));
  const publisher = await Publisher.findPublisher(product.publisherid);
  res.render('store/product', { product, publisher });
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

  res.redirect('/store/cart')
  //res.render('store/cart.ejs', { products })
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
    
    res.redirect('/store/cart')
    //res.render('store/cart.ejs', { products })
  } catch (error) {
    console.log("ADD TO SHOPPING CART ERROR: ", error);
    res.redirect('/store/product/' + req.params.productid)
  }
})

router.get('/checkout', async function(req, res, next) {
  console.log("CHECKOUT PAGE OPENED");

  user = await User.findUser("testuser", "123")
  
  carts = await ShoppingCart.findCart(user.userid)

  products = []
  for (cart of carts) {
    products.push(await Product.findProduct(cart.dataValues.productid));
  }

  res.render('store/checkout.ejs', { user, products })
})

router.get('/:page', function(req, res, next) {
  res.render('store/' + req.params.page);
});

module.exports = router;
