var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require ('express-fileupload');
var cors = require('cors');

require('dotenv').config();
var session = require('express-session');


var pool = require('./models/bd');


var session = require('express-session');

var indexRouter = require('./routes/index'); 
var plusRouter = require('./routes/admin/plus');
var apiRouter = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//CERCA DE LA PALABRA PUBLIC
app.use(session({
  secret: 'tortuga2022',
  cookie: {maxAge:null},
  resave: false,
  saveUninitialized: true
}));


app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: '/tmp/'
}));


app.use('/', indexRouter);
app.use('/admin/plus', plusRouter);
app.use('/api',cors(), apiRouter);


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

module.exports = app;
