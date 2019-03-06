const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const travelSchema = new Schema({
  title: String,
  description: String,
  images: [ {url: String, public_id: String} ],
  location: String,
  createdAt: {type: Date, default: Date.now},
  geometry: {
  	type: {
  	  type: String,
  	  enum: ['Point'],
  	  required: true
  	},
  	coordinates: {
  	  type: [Number],
  	  required: true
  	}
  },
  properties: {
  	description: String
  },
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

travelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Travel', travelSchema);
