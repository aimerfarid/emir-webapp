const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  sets: Number,
  reps: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

module.exports = mongoose.model('Workout', workoutSchema);
