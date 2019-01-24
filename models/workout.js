const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const workoutSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  reps: String,
  sets: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

workoutSchema.pre('remove', async function() {
  await Comment.remove({
    _id: {
      $in: this.comments
    }
  });
});

module.exports = mongoose.model('Workout', workoutSchema);
