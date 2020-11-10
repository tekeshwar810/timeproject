const { model } = require('./connection')
var db = require('./connection')
function customerModel() {

    this.itemQuantity = (customerid) => {

        return new Promise((resolve,reject) => {
            db.collection('cart').find({"customerId":customerid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }    
    this.addCart = (pName,pPrice,pImage,customerId) => {
        var addCart={}
        addCart.pName = pName;
        addCart.pPrice = pPrice;
        addCart.pImage = pImage;
        addCart.customerId = customerId;
        
        return new Promise((resolve,reject) => {
            db.collection("cart").find().toArray((err, result) => {
                if (err)
                    console.log(err)
                else {
                    if (result.length == 0) {
                        addCart._id = 1
                    }
                    else {
                        var max_id = result[0]._id

                        for (let row of result) {

                            if (max_id < row._id)
                                max_id = row._id
                        }
                        addCart._id = max_id + 1
                    }
                    db.collection('cart').insertOne(addCart, (err, result) => {
                        err ? reject(err) : resolve(result)
                    })
                }
            })
          
        })
    }

    this.showCartProduct = (customerid) => {
        return new Promise((resolve,reject) => {
            db.collection('cart').find({"customerId":customerid}).toArray((err,result)=>{
                err ? reject(err) : resolve(result)
            })
        })
    }    

    this.removecartitem = (removeitemid) => {
        return new Promise((resolve,reject) => {
            db.collection('cart').remove({"_id":parseInt(removeitemid)},(err,result)=>{
                
            err ? reject(err) : resolve(result)
        })
    })
  }
}
module.exports = new customerModel();