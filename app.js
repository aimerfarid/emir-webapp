if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const seedPosts = require('./seeds');
// seedPosts();

// Require Routes
const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blogs');
const commentRouter = require('./routes/comments');
const travelRouter = require('./routes/travels');
const workoutRouter = require('./routes/workouts');

const app = express();

// connect to the database
mongoose.connect(process.env.DATABASE_MONGO_ATLAS, {
  useNewUrlParser: true,
  useCreateIndex: true
 });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function() {
  console.log('We are Connected!')
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'LOGO_1.png')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.locals.moment = require('moment');

// Configure Passport and Sessions
app.use(session({
  secret: 'personal website shh!',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use(function(req, res, next) {
  // req.user = {
	// '_id' : '5c5b565321af2022628995da',
  // 'isAdmin' : 'true',
	// '_id' : '5c437f0092dd9a55ae3a9d9c',
	// '_id' : '5c4a1c05d2128e86193f6075',
	// 'username' : 'AimerFarid'
  // }
  res.locals.currentUser = req.user;
  // set default page title
  res.locals.title = 'Emir Website';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();
});

// Mount Routes
app.use('/', indexRouter);
app.use('/blogs', blogRouter);
app.use('/blogs/:id/comments', commentRouter);
app.use('/travels', travelRouter);
app.use('/travels/:id/comments', commentRouter);
app.use('/workouts', workoutRouter);
app.use('/workouts/:id/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  //
  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
