const { Result } = require('express-validator')
var db = require('./connection')
var MAIL = ''
var RESMAIL = ''
var MOB = ''
var RESMOB = ''
function usermodel() {
   this.changepass = (oldpass, newpass, ReqId) => {
      var ReqId = parseInt(ReqId)
      console.log(oldpass, newpass)
      return new Promise((resolve, reject) => {
         db.collection('register').find({ "password": oldpass, "_id": ReqId }).toArray((err, result) => {

            if (result.length > 0) {
               if (result[0]._id == ReqId) {
                  db.collection('register').updateOne({ "_id": ReqId }, { $set: { "password": newpass } })
                  err ? reject(err) : resolve(result)
               }
            }
            err ? reject(err) : resolve(result)
         })
      })
   }
   this.getuserDetails = (reqid) => {
      return new Promise((resolve, reject) => {
         db.collection('register').find({ "_id": parseInt(reqid) }).toArray((err, result) => {
            err ? reject(err) : resolve(result)
         })
      })

   }
   this.setuserDetails = (setdata, reqid) => {
      return new Promise((resolve, reject) => {
         db.collection('register').updateMany({ "_id": parseInt(reqid) }, { $set: { "fname": setdata.fname, "lname": setdata.lname, "email": setdata.email, "mobile": setdata.mobile } }, (err, result) => {
            db.collection('register').find({ "_id": parseInt(reqid) }).toArray((err, result) => {
               err ? reject(err) : resolve(result)
            })
         })
      })
   }
   this.showProduct = (userId) => {
      return new Promise((resolve, reject) => {
         db.collection('products').find({ "userId": userId }).toArray((err, result) => {
            err ? reject(err) : resolve(result)
         })
      })

   }
   this.RemoveProduct = (productId) => {
      return new Promise((resolve, reject) => {
         db.collection('products').remove({ "_id": parseInt(productId) }, (err, result) => {
            db.collection('launchproduct').remove({ "pId": productId }, (err, result) => {
               err ? reject(err) : resolve(result)
            })
            err ? reject(err) : resolve(result)
         })
      })

   }
   this.addProduct = (pname, pprice, pimgName, userId,CatName) => {
      return new Promise((resolve, reject) => {
         db.collection('products').find().toArray((err, result) => {
            var pInfo = {}
            pInfo.pname = pname
            pInfo.pprice = pprice
            pInfo.pimgName = pimgName
            pInfo.userId = userId
            pInfo.CatName = CatName
            pInfo.pStatus = 0
            if (err)
               console.log(err)
            else {
               if (result.length == 0) {
                  pInfo._id = 1
               }
               else {
                  var max_id = result[0]._id
                  for (let row of result) {
                     if (max_id < row._id)
                        max_id = row._id
                  }
                  pInfo._id = max_id + 1
               }

               db.collection('products').insertOne(pInfo, (err, result) => {
                  db.collection('products').find({ "userId": userId }).toArray((err, result) => {
                     err ? reject(err) : resolve(result)

                  })
               })
            }
         })
      })
   }



}

module.exports = new usermodel()