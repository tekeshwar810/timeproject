var mongoose=require('mongoose')
var url="mongodb://localhost:27017/employee"
mongoose.connect(url)
var db=mongoose.connection
console.log("Connected to mongodb Database....")
module.exports=db