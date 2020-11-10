var express = require('express');
var path = require('path')
var url = require('url')
var usermodel = require('../models/usermodel');
// var indexmodel = require('../models/indexmodel')
var router = express.Router();
var {check, validationResult} = require('express-validator');
const { setuserDetails, showProduct } = require('../models/usermodel');
const adminmodel = require('../models/adminmodel');
var GetDetails =''
var SetDetails =''
var addProduct=''
var showproduct =''
var pimg = ''
var userId=''
var catName 
/*this middleware for security*/
router.use(function(req, res, next) {
  if(req.session.sunm != undefined && req.session.role == "user"){
     next()
  }
  else{
    res.redirect("/login")
 }
 adminmodel.fetchall().then((result)=>{
    catName = result
 }).catch((error)=>{
   console.log(console.log(error))
   })
 })

/*Get The user Home Page*/
router.get('/', function(req, res, next) {
  res.render('user/usersHome.ejs',{'sunm':req.session.sunm})
  
});

/* Remove Product By The User */
router.get('/removeProduct', function(req, res, next) {
  var productId = url.parse(req.url,true).query.id
  usermodel.RemoveProduct(productId).then((result)=>{
   res.redirect('/user/additem')
  }).catch((error)=>{
    console.log(error)
  })
  
 });

 /* Item Will Be Show When Get The additem Link  */
router.get('/additem', function(req, res, next) {
  userId = req.cookies.id
  usermodel.showProduct(userId).then((result)=>{
  showproduct = result
   res.render('user/additem.ejs',{'catname':catName,'Msg':'','showProduct':showproduct,'addProduct':'','sunm':req.session.sunm})  
  }).catch((error)=>{
     console.log(error)
  })
});

/* Item Will Be Add In the User Panel */
router.post('/additem', function(req, res, next) {
  var CatName = req.body.CatName
  var pname = req.body.pname
  var pprice = req.body.pprice
  var pimage = req.files.pimage
  var pimgName = Date.now()+"-"+pimage.name
  var filepath = path.join(__dirname,'../public/fileupload/Product',pimgName)
  userId = req.cookies.id
  usermodel.addProduct(pname,pprice,pimgName,userId,CatName).then((result)=>{
  pimage.mv(filepath)    
  addProduct = result
  res.render('user/additem.ejs',{'catname':catName,'Msg':'Product Added Successfully....','sunm':req.session.sunm,'showProduct':'','addProduct':addProduct})
  }).catch((error)=>{
    console.log(error)
  })
  
});

/*Get the page change profile and user details will be see in input tag */
router.get('/changeprofile', function(req, res, next) {
  var reqid = req.cookies.id
  usermodel.getuserDetails(reqid).then((result)=>{
  GetDetails = result
  res.render('user/changeprofile.ejs',{'msg':'','Getdetails':GetDetails,'Setdetails':'','sunm':req.session.sunm})
  }).catch((error)=>{
   console.log(error) 
  })
});

/* user profile change and update data will be see in input tag */
router.post('/changeprofile', function(req, res, next) {
  var reqid = req.cookies.id
  console.log(reqid)
  usermodel.setuserDetails(req.body,reqid).then((result,resultL)=>{
     SetDetails = result  
      res.render('user/changeprofile.ejs',{'msg':'Your Profile Successfully','Getdetails':'','Setdetails':SetDetails,'sunm':req.session.sunm})
     
  }).catch((error)=>{
    console.log(error)
  })
});

/* Get The page Change password */
router.get('/changepassword', function(req, res, next) {
  res.render('user/changepassword.ejs',{'errPass':'','Err':'','Msg':'','sunm':req.session.sunm})
});

/* User Password Change, Validation */
router.post('/changepassword',[
check('confirmpass').trim().custom((value,{req})=>{
  if(value != req.body.newpass){
  throw new Error('Your Password not Match')
  }
  else{
    throw new Error('undefined')
  }
})
],function(req, res, next){
  var Error = validationResult(req)
    var ErrorAry = Error.array()
    for(row of ErrorAry){
      if(row.msg != 'undefined'){
        res.render('user/changepassword.ejs',{'Getdetails':'','sunm':req.session.sunm,'Err':'','errPass':Error.array(),'Msg':'',});
      }
      else{
    /* above the code for validation this part manage from frontend but i manage from backend */
  var newpass = req.body.newpass
  var oldpass = req.body.oldpass
  var ReqId = req.cookies.id
  usermodel.changepass(oldpass,newpass,ReqId).then((result)=>{
    if(result.length > 0){
      res.render('user/changepassword.ejs',{'Getdetails':'','errPass':'','Msg':'Password Successfully Change...','Err':'','sunm':req.session.sunm})
    }
    else{
      res.render('user/changepassword.ejs',{'Getdetails':'','errPass':'','Msg':'','Err':'Old Password Is Wrong...','sunm':req.session.sunm})
    }
  }).catch((error)=>{
    console.log(error)
  })
}
}
});
module.exports = router;

