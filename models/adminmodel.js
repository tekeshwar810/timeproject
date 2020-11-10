var db = require('./connection')
function adminModel() {
    /* user details fetch function*/
    this.fetchUsers = () => {
        return new Promise((resolve, reject) => {
            db.collection('register').find({ "role": "user" }).toArray((err, result) => {
                err ? reject(err) : resolve(result)

            })
        })
    }

    /* fetch all category collection data*/
    this.fetchall = () => {
        return new Promise((resolve, reject) => {
            db.collection('category').find().toArray((err, result) => {
                err ? reject(err) : resolve(result)

            })
        })
    }

    /* Manage user status function*/
    this.manageuserstatus = (urlObj) => {

        return new Promise((resolve, reject) => {
            if (urlObj.s == 'block') {
                db.collection('register').updateOne({ "_id": parseInt(urlObj.regid) }, { $set: { "status": 0 } }, (err, result) => {
                    err ? reject(err) : resolve(result)
                })
            }
            else if (urlObj.s == 'verify') {
                db.collection('register').updateOne({ "_id": parseInt(urlObj.regid) }, { $set: { "status": 1 } }, (err, result) => {
                    err ? reject(err) : resolve(result)
                })
            }
            else {
                db.collection('register').remove({ "_id": parseInt(urlObj.regid) }, (err, result) => {
                    err ? reject(err) : resolve(result)
                })
            }
        })
    }

    /* Add Category function*/
    this.addcategory = (catnm, filename) => {

        return new Promise((resolve, reject) => {
            db.collection("category").find().toArray((err, result) => {

                var cDetails = {}
                cDetails.catnm = catnm
                cDetails.caticon = filename

                if (err)
                    console.log(err)
                else {
                    if (result.length == 0) {
                        cDetails._id = 1
                    }
                    else {
                        var max_id = result[0]._id
                        for (let row of result) {
                            if (max_id < row._id)
                                max_id = row._id
                        }
                        cDetails._id = max_id + 1
                    }
                    db.collection('category').insertOne(cDetails, (err, result) => {
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })

    }

    /* Add Sub Category function*/
    this.addsubcategory = (catnm, subcatnm, filename) => {

        return new Promise((resolve, reject) => {
            db.collection("subcategory").find().toArray((err, result) => {
                var sDetails = {}
                sDetails.catnm = catnm
                sDetails.caticon = filename
                sDetails.subcatnm = subcatnm
                if (err)
                    console.log(err)
                else {
                    if (result.length == 0) {
                        sDetails._id = 1
                    }
                    else {
                        var max_id = result[0]._id
                        for (let row of result) {
                            if (max_id < row._id)
                                max_id = row._id
                        }
                        sDetails._id = max_id + 1
                    }
                    db.collection('subcategory').insertOne(sDetails, (err, result) => {
                        err ? reject(err) : resolve(result)
                    })
                }
            })
        })

    }

}
module.exports = new adminModel()