require('dotenv').config;

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const User = require('./models/user');
// const session = require('express-session');
const mongoose = require('mongoose');
// const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blogs');
const travelRouter = require('./routes/travels');
const userRouter = require('./routes/users');
const workoutRouter = require('./routes/workouts');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/blogs', blogRouter);
app.use('/travels', travelRouter);
app.use('/users', userRouter);
app.use('/workouts', workoutRouter);

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
