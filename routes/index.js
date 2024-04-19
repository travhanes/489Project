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

router.post('/login', async function(req, res, next) {
  var backlink = "/account" + req.session.next

  const user = await User.findUser(req.body.username, req.body.password)
  if(user !== null){
    req.session.user = user
    res.redirect(backlink)
  }else{
    res.locals.msg = "Login failed"
    res.render('account/login')
  }
});

router.get('/logout', function(req,res, next){
  if(req.session.user){
    req.session.destroy()
    //req.session.next = "/account/account"
    //res.locals.msg = "Logged out"
    //res.redirect('account/account')
    res.render('account/login')
  }/*else {
    res.redirect("/")
  }*/

  res.redirect("/")
})

module.exports = router;
