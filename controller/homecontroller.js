function homecontroller(){

    return{
        index(req, res, next) {
            res.render('visiter/index.ejs');
          }
    }
}
module.exports = homecontroller
