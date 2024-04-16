var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('store/index');
});

router.get('/store', function(req, res, next) {
  res.redirect('/');
});

router.get('/store/:page', function(req, res, next) {
  res.render('store/' + req.params.page);
});

router.get('/account/:page', function(req, res, next) {
  res.render('account/' + req.params.page);
});

module.exports = router;
