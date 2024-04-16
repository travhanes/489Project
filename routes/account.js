var express = require('express');
const User = require('../models/User');
var router = express.Router();

const user = null;
// const user = await User.findByPk(userid)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('account/account.ejs');
});

router.get('/:page', function(req, res, next) {
  res.render('account/' + req.params.page, { user, page: req.params.page });
});

module.exports = router;
