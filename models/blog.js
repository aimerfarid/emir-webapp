const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const blogSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  category: String,
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
  ]
});

blogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Blog', blogSchema);
