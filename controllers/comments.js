const Blog = require('../models/blog');
const Workout = require('../models/workout');
const Comment = require('../models/comment');

module.exports = {
  /* WORKOUT ROUTES for Comments */
  // Comments Create
  async commentCreate(req, res, next) {
    // find the workout by its id
    let workout = await Workout.findById(req.params.id).populate('comments').exec();
    let haveCommented = workout.comments.filter(comment => {
      return comment.author.equals(req.user._id);
    }).length;
    if (haveCommented) {
      req.session.error = 'Sorry, you can only create one comment per post!';
      return res.redirect(`/workouts/${workout.id}`);
    }
    // create the comment
    req.body.comment.author = req.user._id;
    let comment = await Comment.create(req.body.comment);
    // assign comment to workout
    workout.comments.push(comment);
    // save the workout
    workout.save();
    // redirect to the workout
    req.session.success = 'Comment created successfully!';
    res.redirect(`/workouts/${workout.id}`);
  },
  // Comments Update
  async commentUpdate(req, res, next) {
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    req.session.success = 'Comment updated successfully!';
    res.redirect(`/workouts/${req.params.id}`);
  },
  // Comments Destroy
  async commentDestroy(req, res, next) {
    await Workout.findByIdAndUpdate(req.params.id, {
      $pull: { comments: req.params.comment_id }
    });
    await Comment.findByIdAndRemove(req.params.comment_id);
    req.session.success = 'Comment removed successfully!';
    res.redirect(`/workouts/${req.params.id}`);
  }
}
