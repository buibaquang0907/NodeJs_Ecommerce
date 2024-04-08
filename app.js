var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'login.html'));
});
app.get('/register', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'register.html'));
});
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'home.html'));
});
app.get('/cart', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'cart.html'));
});
app.get('/users', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'users.html'));
});
app.get('/edit-user/:i', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'edit-user.html'));
});
app.get('/order', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'order.html'));
});
app.get('/checkout', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'checkout.html'));
});
app.get('/changepassword/:i', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'changepassword.html'));
});
app.get('/forgotpassword', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views', 'forgotpassword.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect("mongodb://localhost:27017/NodeJs-Ecommerce").then(
  function () {
    console.log("connected");
  }
).catch(function () {
  console.log("error");
})

module.exports = app;
