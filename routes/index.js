var express = require('express');
const User = require('../models/User');
const ShoppingCart = require('../models/ShoppingCart')
const Product = require("../models/Product")
const Wishlist = require('../models/Wishlist')
const { v4: uuidv4 } = require('uuid');

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
  }

  res.redirect("/")
})

router.post('/signup', async function(req, res, next) {
  if (req.body.password !== req.body.confirmpassword) {
    res.locals.msg = "Passwords don't match"
    res.render('store/signup')
  }
  else if (User.existingUsername(req.body.username) === true) {
    res.locals.msg = "Username is taken"
    res.render('store/signup')
  }
  else {
    await User.create({userid: uuidv4(), username: req.body.username, password: req.body.password})
    res.redirect('account/account')
  }
});

module.exports = router;
