var express = require('express');
var url = require('url')
var router = express.Router();
var customerModel = require('../models/customermodel')
var indexModel = require('../models/indexmodel')
var show = ''
var itemQuantity = ''
var customerid = ''
var showItemCart =''
var len=''

router.use((req,res,next)=>{
  res.locals.session = req.session
  next()
})

router.get('/', function (req, res, next) {
  indexModel.showlaunch().then((result) => {
    show = result
    res.render('customer/customerHome.ejs',{'show':show});
  }).catch((err) => {
    console.log(err)
  })
});

router.post('/updateCart',function(req,res,next){
  var price = parseInt(req.body.pPrice) 
  if(!req.session.cart){
      req.session.cart = { 
      items : {},
      totalqty:0,
      totalprice:0
    }
  }
var cart = req.session.cart
// check if item does not exist in cart
if(!cart.items[req.body._id]){
  cart.items[req.body._id] ={
    item: req.body,
    qty: 1
  }
  cart.totalqty = cart.totalqty + 1
  cart.totalprice = cart.totalprice + price
}
else{
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
    cart.totalqty = cart.totalqty + 1
    cart.totalprice = cart.totalprice + price
}
res.json({totalqty:req.session.cart.totalqty})
});

router.get('/cartPage', function (req, res, next) {
  item = (req.session.cart.items)
  res.render('customer/addcart.ejs',{'item':item});
});


module.exports = router;
