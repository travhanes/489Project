var express = require('express');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('account/account.ejs');
});

router.get('/wishlist', async function(req, res, next) {
  user = await User.findUser("testuser", "123")
  
  wishlists = await Wishlist.findWishlist(user.userid)

  products = []
  for (wishlist of wishlists) {
    products.push(await Product.findProduct(wishlist.dataValues.productid));
  }

  res.render('account/wishlist.ejs', { user, page: 'wishlist', products });
})

router.get('/wishlist/delete/:productid', async function(req, res, next) {
  console.log('WISHLIST DELETE REQUESTED');

  user = await User.findUser("testuser", "123")
  wish = await Wishlist.findWishlistProduct(user.userid, req.params.productid)
  wish.destroy()

  wishes = await Wishlist.findWishlist(user.userid)

  products = []
  for (wish of wishes) {
    products.push(await Product.findProduct(wish.dataValues.productid));
  }

  // res.render('account/wishlist.ejs', { user, page: 'wishlist', products });
  res.redirect('/account/wishlist');
})

router.get('/:page', function(req, res, next) {
  res.render('account/' + req.params.page, { page: req.params.page });
});



module.exports = router;
