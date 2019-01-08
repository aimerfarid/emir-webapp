const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  categories: String,
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

module.exports = mongoose.model('Blog', blogSchema);
