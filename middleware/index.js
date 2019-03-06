const Comment = require('../models/comment');
const User = require('../models/user');
const Blog = require('../models/blog');
const Travel = require('../models/travel');
const Workout = require('../models/workout');
const { cloudinary } = require('../cloudinary');

const middleware = {
  asyncErrorHandler: (fn) =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next))
             .catch(next);
    },
  isCommentAuthor: async (req, res, next) => {
    let comment = await Comment.findById(req.params.comment_id);
    if(comment.author.equals(req.user._id)) {
      return next();
    }
    req.session.error = 'Bye bye';
    return res.redirect('/');
  },
  isLoggedIn: async (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.session.error = 'You need to be logged in to do that!';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
  },
  isAdminWebsite: async (req, res, next) => {
    if (req.user.isAdmin) return next();
    req.session.error = 'You need to be an admin to do that!';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/index');
  }
  ,
  isAuthorB: async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (blog.author.equals(req.user._id) || req.user.isAdmin) {
      res.locals.blog = blog;
      return next();
    }
    req.session.error = 'Access denied!';
    res.redirect('back');
  },
  isAuthorT: async (req, res, next) => {
    const travel = await Travel.findById(req.params.id);
    if (travel.author.equals(req.user._id) || req.user.isAdmin) {
      res.locals.travel = travel;
      return next();
    }
    req.session.error = 'Access denied!';
    res.redirect('back');
  },
  isAuthorW: async (req, res, next) => {
    const workout = await Workout.findById(req.params.id);
    if (workout.author.equals(req.user._id) || req.user.isAdmin) {
      res.locals.workout = workout;
      return next();
    }
    req.session.error = 'Access denied!';
    res.redirect('back');
  },
  isValidPassword: async (req, res, next) => {
    const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
    if (user) {
      // add user to res.locals
      res.locals.user = user;
      next();
    } else {
      middleware.deleteProfileImage(req);
      req.session.error = 'Incorrect Current Password!';
      return res.redirect('/profile');
    }
  },
  changePassword: async (req, res, next) => {
    const {
      newPassword,
      passwordConfirmation
    } = req.body;

    if (newPassword && !passwordConfirmation) {
      middleware.deleteProfileImage(req);
      req.session.error = 'Missing password confirmation!';
      return res.redirect('/profile');
    } else if (newPassword && passwordConfirmation) {
      const { user } = res.locals;
      if( newPassword === passwordConfirmation) {
        await user.setPassword(newPassword);
        next();
      } else {
        middleware.deleteProfileImage(req);
        req.session.error = 'New Passwords Must Match!';
        return res.redirect('/profile');
      }
    } else {
      next();
    }
  },
  deleteProfileImage: async req => {
    if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
  }
};

module.exports = middleware;
