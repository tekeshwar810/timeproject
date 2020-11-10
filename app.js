require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var fileupload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');
var customerRouter = require('./routes/customer')
const flash = require('express-flash')
const db = require('./models/connection')

const MongoDbStore = require('connect-mongo')(session)// session store in mongodb
var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileupload());
// app.use(flash()); //when you first req send to server then server is create a session id and when he res back than respone header ke through cookies me session id store ho jayegi but second req per req header ke through cookeis se seesion id server k pas jayegi jisse server new session id create nhi krega or res me cookies me bhi new session id nhi ayegi//

//session store
// let mongoStore = new MongoDbStore({
//   mongooseConnection : db, //conection name
//   collection : 'sessions'
// })

//session config
// app.use(session({
//   secret : process.env.COOKIE_SECRET,
//   resave : false,
//   saveUninitialized : false,
//   store : mongoStore,
//   cookie : {maxAge : 1000*60*60*24} //24 hour
// })); 
app.use(session({secret : 'thisismykey'}))
app.use(express.static(path.join(__dirname, 'public')));//static file load just like css,js,img,png etc

//middleware router
app.use('/customer' , customerRouter)
app.use('/admin', adminRouter);
app.use('/user', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
