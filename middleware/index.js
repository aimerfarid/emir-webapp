const Comment = require('../models/comment');

module.exports = {
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
  }
}
