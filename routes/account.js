var express = require('express');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Publisher = require('../models/Publisher');
const Product = require('../models/Product')
const ShoppingCart = require('../models/ShoppingCart')
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem');
const Library = require('../models/Library');
var router = express.Router();

router.use((req, res, next) => {
  user = req.session.user
  
  if (user === undefined) {
    req.session.next = req.path
    res.render('account/login');
  }
  else {
    next()
  }
})

router.get('/account', function(req, res, next) {
  res.render('account/account.ejs', {page: 'account'});
});

router.get('/library', async function(req, res, next) {
  console.log("LIBRARY PAGE REQUESTED");
  
  user = req.session.user
  
  libraries = await Library.findLibraries(user.userid)

  products = []
  for (library of libraries) {
    lib = library.dataValues
    product = (await Product.findProduct(library.dataValues.productid)).dataValues
    publisher = (await Publisher.findByPk(product.publisherid)).dataValues
    products.push([product, publisher, lib]);
  }

  console.log(products);

  res.render('account/library.ejs', { user, page: 'library', products });
})

router.get('/orders', async function(req, res, next) {
  user = req.session.user
  orders = await Order.findOrders(user.userid)
  parsed_orders = []
  for (order of orders) {
    parsed_orders.push(order.dataValues)
  }
  
  console.log(parsed_orders);

  order_dictionary = {}
  // dictionary: key = order_id, value = list of products
  for (order of parsed_orders) {
    orderItems = await OrderItem.findItems(order.orderid)

    items = []
    for (orderItem of orderItems) {
      items.push(orderItem.dataValues)
    }

    products = []
    for (item of items) {
      products.push((await Product.findProduct(item.productid)).dataValues)
    }

    order_dictionary[order.orderid] = products
  }

  console.log(order_dictionary)

  res.render('account/orders.ejs', { page: 'orders', parsed_orders, order_dictionary });
})

router.get('/wishlist', async function(req, res, next) {
  user = req.session.user
  
  wishlists = await Wishlist.findWishlist(user.userid)

  products = []
  for (wishlist of wishlists) {
    products.push(await Product.findProduct(wishlist.dataValues.productid));
  }

  res.render('account/wishlist.ejs', { user, page: 'wishlist', products });
})

router.get('/wishlist/delete/:productid', async function(req, res, next) {
  console.log('WISHLIST DELETE REQUESTED');

  user = req.session.user
  wish = await Wishlist.findWishlistProduct(user.userid, req.params.productid)
  wish.destroy()

  wishes = await Wishlist.findWishlist(user.userid)

  products = []
  for (wish of wishes) {
    products.push(await Product.findProduct(wish.dataValues.productid));
  }

  res.redirect('/account/wishlist');
})

router.post('/wishlist/add/:productid', async function(req, res, next) {
  console.log("WISHLIST PRODUCT ADD REQUEST");

  user = req.session.user
  
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

router.get('/publisher/:publisherid', async function(req, res, next) {
  const publisher = await Publisher.findPublisher(req.params.publisherid);
  const products = await Product.findByPublisher(publisher.publisherid);
  res.render('account/publisher', { page: 'publisher', publisher, products });
});

router.get('/publisher', function(req, res, next) {
  res.redirect('publisher/0');
});

router.get('/:page', function(req, res, next) {
  res.render('account/' + req.params.page, { page: req.params.page });
});

module.exports = router;
