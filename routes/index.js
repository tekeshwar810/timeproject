var express = require('express');
var router = express.Router();
var homecontroller = require('../controller/homecontroller')
var indexModel = require('../models/indexmodel')
var sendEmail = require('./mailapi')
var sendSMS = require('./smsapi')
var url = require('url');
// const { ValidatorsImpl } = require('express-validator/src/chain');
var { check, validationResult } = require('express-validator');
const { pid } = require('process');
// const { send } = require('process');
var productName = ''
var productPrice = ''
var email = ''
var pass = ''
var resetPassId = ''

/* Session Destroy */
router.use('/login', function (req, res, next) {
  if (req.cookies.email != undefined){
    email = req.cookies.email
    pass = req.cookies.password
  }
  if(req.session.sunm != undefined){
    req.session.destroy()
  }
  next()
})

/* GET home page. */
router.get('/', homecontroller().index);

/* GET about page. */
router.get('/about', function (req, res, next) {

  res.render('visiter/about.ejs');
});

/* GET contact page. */
router.get('/contact', function (req, res, next) {
  res.render('visiter/contact.ejs');
});

/* GET product page. with Product Will Be Show When Lauch By The User */
router.get('/product', function (req, res, next) {
  indexModel.showlaunch().then((result) => {
  var show = result
  res.render('visiter/product.ejs', { 'show': show })
  }).catch((error) => {
    console.log(error)
  })
});

/* Launch The Product By The User */
router.get('/launchProduct', function (req, res, next) {
  var All = url.parse(req.url, true).query
  console.log(All)
  pcat = All.CatName
  pStatus = All.productStatus
  pName = All.productName
  pPrice = All.productPrice
  pId = All.productId
  pImage = All.productImage
  UserId = All.UserId
  
  indexModel.plaunch(pName, pPrice, pId, pImage, UserId, pStatus,pcat).then((result) => {
  res.redirect('/user/additem');
  }).catch((error) => {
    console.log(error)
  })
});

/* Email Send For The User Verification */
router.get('/verifyuser', function (req, res, next) {
  var email = url.parse(req.url, true).query.email
  indexModel.VerifyUser(email).then((result) => {
  res.redirect('/login');
  }).catch((err) => {
    console.log(err)
  })
});

/* Get The Register Page */
router.get('/registration', function (req, res, next) {
  res.render('visiter/registration.ejs', { 'err': '', 'msg': '','ExistMail':'','ExistMobile':'' });
});

/* validation, Email and Mobile duplicate entry will not be Register, User Details Insert In Data Base */
router.post('/registration', [
  check('fname').trim().isAlpha().withMessage('Please Enter Only Alphabat'),
  check('lname').trim().isAlpha().withMessage('Please Enter Only Alphabat'),
  check('email').trim().isEmail().withMessage('Please Enter Vaild Email ID'),
  check('mobile', 'Please Enter Vaild Mobile Number ').trim().isMobilePhone()
], function (req, res, next) {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    res.render('visiter/registration.ejs', { 'err': error.mapped(), 'msg': '', 'ExistMail':'','ExistMobile':'' });
  } 
  else {
/* above the code for validation this part manage from frontend*/
    indexModel.checkregister(req.body).then((result) => {
      if (result.length === 0) {
        indexModel.registerUser(req.body).then((result) => {
          res.render('visiter/registration.ejs', { 'err': '', 'ExistMail':'','ExistMobile':'','msg': 'Your Form Successfully Registered Please Verify Your Account From Email' });
         }).catch((err) => {
           console.log(err)
         })
      }

      else {
        if(result[0].CodeErr == 1){
          ExistMail=result;
          console.log(ExistMail)
          res.render('visiter/registration.ejs', { 'err': '', 'msg': '','ExistMail':ExistMail,'ExistMobile':''});
        }
        else if(result[0].CodeErr == 2){
          ExistMobile=result;
          res.render('visiter/registration.ejs', { 'err': '', 'msg': '','ExistMobile':ExistMobile,'ExistMail':''});
        }
      }
    }).catch((err) => {
      console.log(err)
    })
  }
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('visiter/login.ejs', { 'msg': '', 'emailid': email, 'password': pass });
});

/* Login User And Admin Check Method and user email id and password will be save when the remember by using cookies method, and also apply session method for security and user tracking*/
router.post('/login', function (req, res, next) {

  indexModel.loginUser(req.body).then((result) => {
    if (result.length > 0) {
      console.log(result)
    var ID = result[0]._id
    res.cookie("id", ID, { maxAge: 3600000 * 24 * 365 })


      if (req.body.check != undefined) {
        res.cookie("email", req.body.email, { maxAge: 360000 * 24 * 365 })
        res.cookie("password", req.body.password, { maxAge: 360000 * 24 * 365 })
      }
            req.session.sunm = result[0].email
            req.session.role = result[0].role
      
      if (result[0].role == "admin") {
        res.redirect('/admin')
      }
      else if(result[0].role == "user") {
        res.redirect('/user')
      }
    }
    else {
      res.render('visiter/login.ejs', { 'msg': 'Invalild User Or Verify Your Account', 'emailid': '', 'password': '' })
    }

  }).catch((err) => {
    console.log(err)
  })
});

/* Get The Page Forget Password when the user click forget password link*/
router.get('/forgetpassword', function (req, res, next) {
  res.render('visiter/forgetpassword.ejs', { 'msg': '', 'Err': '' });
});

router.post('/forgetpassword', function (req, res, next) {
  var mobile = req.body.mobile
  indexModel.forgetpass(mobile).then((result) => {
    console.log(result)
    if (result.length > 0) {
      var details = result
      var mailid = details[0].email
      sendEmail.recoverPassword(mailid)
      console.log('rut it mail')
      res.render('visiter/forgetpassword.ejs', { 'msg': 'The Link Send In Your Register Mail Id', 'Err': '' });
    }
    else {
      res.render('visiter/forgetpassword.ejs', { 'Err': 'Please Enter Your Registerd Mobile No', 'msg': '' });
    }
  }).catch((error) => {
    console.log(error)
  })

});

/* Get Update Password Page When the User click forget Password link and get the email for reset password */
router.get('/updatepassword', function (req, res, next) {
  res.render('visiter/updatepassword.ejs', { 'msg': '', 'errMsg': '' });
  resetPassId = url.parse(req.url, true).query.mailid
});

router.post('/updatepassword', [
  check('confirmpass').trim().custom((value, { req }) => {
    if (value != req.body.newpass) {
      throw new Error('Your Password not Match')
    }
    else {
      throw new Error('undefined')
    }
  })
],
  function (req, res, next) {
    var Error = validationResult(req)
    var ErrorAry = Error.array()
    for (row of ErrorAry) {
      if (row.msg != 'undefined') {
        res.render('visiter/updatepassword.ejs', { 'sunm': '', 'msg': '', 'errMsg': Error.array() });
      }
  else {
    /* above the code for validation this part manage from frontend but i manage from backend*/
    console.log(resetPassId)

 indexModel.resetPassword(resetPassId, req.body.newpass).then((result) => {
 res.render('visiter/updatepassword.ejs', { 'sunm': '', 'msg': 'Your Password Reset Successfully ', 'errMsg': '' });
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  });

module.exports = router;
