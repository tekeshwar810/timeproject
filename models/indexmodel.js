var db = require('./connection')
function indexModel() {

    this.checkregister = (UserInfo) => {
        email = UserInfo.email
        mobile = UserInfo.mobile
        return new Promise((resolve, reject) => {
            db.collection('register').find({ $or: [{ "email": email }, { "mobile": mobile }] }).toArray((err, result) => {
                // console.log(result)
                if (result.length > 0) {

                    for (row of result) {
                        Email = row.email
                        Mobile = row.mobile
                        ExistMail = [
                            {
                                emailErr: 'Email id is already exist',
                                CodeErr: 1
                            },
                        ]
                        ExistMobile = [
                            {
                                mobileErr: 'Mobile number is exist',
                                CodeErr: 2
                            }
                        ]
                        if (email.match(Email)) {
                            resolve(ExistMail)
                        }
                        if (mobile.match(Mobile)) {
                            resolve(ExistMobile)
                        }
                    }
                }
                else {
                    err ? reject(err) : resolve(result)
                    
                }
            })
        })
    }

    this.registerUser = (userDetails) => {
        return new Promise((resolve, reject) => {
            db.collection("register").find().toArray((err, result) => {
                if (err)
                    console.log(err)
                else {
                    if (result.length == 0) {
                        userDetails._id = 1
                    }
                    else {
                        var max_id = result[0]._id

                        for (let row of result) {

                            if (max_id < row._id)
                                max_id = row._id
                        }
                        userDetails._id = max_id + 1
                    }
                    userDetails.role = "user"
                    userDetails.info = new Date()
                    userDetails.status = 0
                    db.collection('register').insert(userDetails, (err, result) => {
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })
    }

    this.VerifyUser = (email) => {
        return new Promise((resolve, reject) => {
            db.collection('register').updateOne({ "email": email }, { $set: { "status": 1 } }, (err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.showlaunch = () => {
        return new Promise((resolve, reject) => {
            db.collection('launchproduct').find().toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.plaunch = (pName, pPrice, pId, pImage, UserId, pStatus,pcat) => {
        return new Promise((resolve, reject) => {
            db.collection('launchproduct').find().toArray((err, result) => {
                var lpInfo = {}
                lpInfo.pName = pName
                lpInfo.pPrice = pPrice
                lpInfo.pImage = pImage
                lpInfo.UserId = UserId
                lpInfo.pId = pId
                lpInfo.pStatus = pStatus
                lpInfo.pcat = pcat
                if (err)
                    console.log(err)
                else {
                    if (result.length == 0) {
                        lpInfo._id = 1
                    }
                    else {
                        var max_id = result[0]._id
                        for (let row of result) {
                            if (max_id < row._id)
                                max_id = row._id
                        }
                        lpInfo._id = max_id + 1
                    }
                }
                db.collection('launchproduct').insertOne(lpInfo, (err, result) => {
                    db.collection('launchproduct').find({ "UserId": UserId }).toArray((err, result) => {

                        if (pStatus == 'launch') {
                            db.collection('products').updateOne({ "_id": parseInt(pId) }, { $set: { "pStatus": 1 } }, (err, result) => {
                                err ? reject(err) : resolve(result)
                            })
                        }
                        else if (pStatus == 'unlaunch') {
                            db.collection('products').updateOne({ "_id": parseInt(pId) }, { $set: { "pStatus": 0 } }, (err, result) => {
                                db.collection('launchproduct').remove({ "pId": pId }, (err, result) => {
                                    err ? reject(err) : resolve(result)
                                })
                            })
                        }
                    })
                })

            })
        })
    }
    this.forgetpass = (mobile) => {

        return new Promise((resolve, reject) => {
            db.collection('register').find({ "mobile": mobile }).toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.loginUser = (userDetails) => {
        return new Promise((resolve, reject) => {
            db.collection('register').find({ "email": userDetails.email, "password": userDetails.password, "status": 1 }).toArray((err, result) => {
                err ? reject(err) : resolve(result)
            })
        })
    }

    this.resetPassword = (Email, NewPass) => {
        return new Promise((resolve, reject) => {
            db.collection('register').updateOne({ "email": Email }, { $set: { "password": NewPass } }, (err, result) => {
                err ? reject(err) : resolve(result)
            })
        })

    }
}

module.exports = new indexModel()