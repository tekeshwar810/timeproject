var express = require('express');
var router = express.Router();
var path = require('path')
var {check, validationResult} = require('express-validator');
var adminmodel = require('../models/adminmodel')
var usermodel = require('../models/usermodel')

var url = require('url')
var clist
/*this middleware for security check*/

router.use(function(req, res, next) {
  if(req.session.sunm != undefined && req.session.role == "admin"){
     next()
  }
  else{
    res.redirect("/login")
  }
  })

/* To Get the Category List by using middleware function*/
router.use('/addsubcategory', function(req, res, next) {
  adminmodel.fetchall().then((result)=>{
  console.log(clist)
  next()
  }).catch((err)=>{
    console.log(err)
  })
});

/* GET admin Home Page */
router.get('/', function(req, res, next) {
  res.render('admin/adminhome.ejs',{'sunm':req.session.sunm})
  
});

router.get('/manageuser', function(req, res, next) {
  adminmodel.fetchUsers().then((result)=>{
  res.render('admin/manageuser.ejs',{"userDetails":result,'sunm':req.session.sunm})
    
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/manageuserstatus', function(req, res, next) {
  var urlObj = url.parse(req.url,true).query
  adminmodel.manageuserstatus(urlObj).then((result)=>{
  res.redirect('/admin/manageuser')
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/addcategory', function(req, res, next) {
  res.render('admin/addcategory.ejs',{'msg':'','sunm':req.session.sunm})
});

router.post('/addcategory', function(req, res, next) {
  var catnm = req.body.catnm
  var caticon = req.files.caticon
  var filename = Date.now()+"-"+caticon.name
  console.log(caticon)
  var filepath = path.join(__dirname,'../public/fileupload/category',filename)
  adminmodel.addcategory(catnm,filename).then((result)=>{
  caticon.mv(filepath)
    res.render('admin/addcategory.ejs',{'msg':'Category added successfully....','sunm':req.session.sunm})  
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/addsubcategory', function(req, res, next) {
  res.render('admin/addsubcategory.ejs',{'msg1':'','clist':clist,'sunm':req.session.sunm})
 });

router.post('/addsubcategory', function(req, res, next) {
  var catnm = req.body.catnm
  var subcatnm = req.body.subcatnm
  var caticon = req.files.caticon
  var filename = Date.now()+"-"+caticon.name
  var filepath = path.join(__dirname,'../public/fileupload/subcategory',filename)
  adminmodel.addsubcategory(catnm,subcatnm,filename).then((result)=>{
    caticon.mv(filepath)
    res.render('admin/addsubcategory.ejs',{'msg1':'Sub Category Added Successfully','clist':clist,'sunm':req.session.sunm})
  }).catch((err)=>{
    console.log(err)
});
});
router.get('/changepasswordadmin', function(req, res, next) {
  res.render('admin/changePassadmin.ejs',{'Err':'','Msg':'','errPass':'','sunm':req.session.sunm})
  
});
router.post('/changepasswordadmin',[
  check('confirmpass').trim().custom((value,{req})=>{
    if(value != req.body.newpass){
    throw new Error('Your Password not Match')
    }
    else{
      throw new Error('undefined')
    }
  })
  ],function(req, res, next) {
    console.log('post method run')
    var Error = validationResult(req)
    var ErrorAry = Error.array()
    for(row of ErrorAry){
      if(row.msg != 'undefined'){
        console.log('password not match')
        res.render('admin/changePassadmin.ejs',{'sunm':req.session.sunm,'Err':'','errPass':Error.array(),'Msg':'',});
      }
      else{
   console.log('else part runn')
  var newpass = req.body.newpass
  var oldpass = req.body.oldpass
  var ReqId = req.cookies.id
  usermodel.changepass(oldpass,newpass,ReqId).then((result)=>{
    if(result.length > 0){
      res.render('admin/changePassadmin.ejs',{'errPass':'','Msg':'Password Successfully Change...','Err':'','sunm':req.session.sunm})
    }
    else{
      res.render('admin/changePassadmin.ejs',{'errPass':'','Msg':'','Err':'Old Password Is Wrong...','sunm':req.session.sunm})
    }
  
  }).catch((error)=>{
    console.log(error)
  })
}
}
});
module.exports = router;


