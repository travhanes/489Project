var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('index');
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.query.msg){
    res.locals.msg = req.query.msg
  }
  res.render('store/index');
});

router.get('/store/:page', function(req, res, next) {
  res.render('store/' + req.params.page);
});

router.get('/account/:page', function(req, res, next) {
  res.render('account/' + req.params.page);
});

router.post('/login', async function(req, res, next) {
  //console.log(req.body.username+" - "+req.body.password);
  const user = await User.findUser(req.body.username, req.body.password)
  if(user!== null){
    req.session.user = user
    res.redirect("/courses")
  }else{
    res.redirect("/?msg=fail")
  }
});

router.get('/logout', function(req,res, next){
  if(req.session.user){
    req.session.destroy()
    res.redirect("/?msg=logout")
  }else {
    res.redirect("/")
  }
  
})

module.exports = router;
