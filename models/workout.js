const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');
const mongoosePaginate = require('mongoose-paginate');

const workoutSchema = new Schema({
  title: String,
  description: String,
  type: String,
  category: String,
  images: [ {url: String, public_id: String} ],
  reps: String,
  sets: Number,
  createdAt: {type: Date, default: Date.now},
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  avgRating: { type: Number, default: 0 }
});

workoutSchema.pre('remove', async function() {
  await Comment.remove({
    _id: {
      $in: this.comments
    }
  });
});

workoutSchema.methods.calculateAvgRating = function() {
  let ratingsTotal = 0;
  if (this.comments.length) {
    this.comments.forEach(comment => {
      ratingsTotal += comment.rating;
    });
    this.avgRating = Math.round((ratingsTotal/this.comments.length)*10) / 10;
  } else {
    this.avgRating = ratingsTotal;
  }
  const floorRating = Math.floor(this.avgRating);
  this.save();
  return floorRating;
}

workoutSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Workout', workoutSchema);
