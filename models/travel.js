const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  location: String,
  coordinates: Array,
  author: {
    type: Schema.Type  s.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

module.exports = mongoose.model('Travel', travelSchema);
