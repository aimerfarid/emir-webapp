const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  location: String,
  coordinates: Array,
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

module.exports = mongoose.model('Travel', travelSchema);
