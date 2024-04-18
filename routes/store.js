var express = require('express');
const User = require('../models/User');
const Publisher = require('../models/Publisher');
const Product = require('../models/Product');
const ShoppingCart = require('../models/ShoppingCart');
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
var router = express.Router();

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/orderComplete', async function(req, res, next) {
  console.log("ORDER COMPLETE PAGE OPENED");

  user = await User.findUser("testuser", "123")

  orderid = Math.floor(getRandomArbitrary(10000, 99999)) // could break if the same number is chosen twice...

  await Order.create({
    orderid: orderid,
    userid: user.userid,
    status: 'Ordered',
    dateOrdered: Date('2024-05-20'),
    dateDelivered: Date('2024-05-20'),
    paymentOption: 1111
  })

  carts = await ShoppingCart.findCart(user.userid)
  products = []
  for (cart of carts) {
    products.push(await Product.findProduct(cart.dataValues.productid));
  }

  for (product of products) {
    await OrderItem.create({
      orderid: orderid,
      productid: product.productid,
      quantity: 1 // have to get this info from the cart...
    })
  }

  res.redirect('/account/orders') // for testing purposes. Use below for actual implementation
  // res.render('store/orderComplete.ejs', {})
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
