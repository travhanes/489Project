var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/:page', function(req, res, next) {
  res.render('store/' + req.params.page);
});

module.exports = router;
