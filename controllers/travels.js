const Travel = require('../models/travel');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'aimercloud96',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
  async travelIndex(req, res, next) {
    let travels = await Travel.find({});
    res.render('travels/index', { travels, title: 'Travel Index' });
  },

  travelNew(req, res, next) {
    res.render('travels/new');
  },

  async travelCreate(req, res, next) {
    // use req.body to create a new travel post
    req.body.travel.images = [];
    for (const file of req.files) {
      let image = await cloudinary.v2.uploader.upload(file.path);
      req.body.travel.images.push({
        url: image.secure_url,
        public_id: image.public_id
      });
    }
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.travel.location,
        limit: 1
      })
      .send();
    // console.log('RESPONSE: ', response);
    req.body.travel.coordinates = response.body.features[0].geometry.coordinates;
    let travel = await Travel.create(req.body.travel);
    // console.log(travel);
    // console.log(travel.coordinates);
    res.redirect(`/travels/${travel.id}`);
  },

  async travelShow(req, res, next) {
    // find id
    let travel = await Travel.findById(req.params.id);
    res.render('travels/show', { travel });
  },

  async travelEdit(req, res, next) {
    // find id
    let travel = await Travel.findById(req.params.id);
    res.render('travels/edit', { travel });
  },

  async travelUpdate(req, res, next) {
    // find the travel by id
    let travel = await Travel.findById(req.params.id);
    // check if there's any images for deletion
    if (req.body.deleteImages && req.body.deleteImages.length) {
      // assign deleteImages from req.body to its own variable
      let deleteImages = req.body.deleteImages;
      // loop over deleteImages
      for (const public_id of deleteImages) {
        // delete images from cloudinary
        await cloudinary.v2.uploader.destroy(public_id);
        // delete image from travel.images
        for (const image of travel.images) {
          if (image.public_id === public_id) {
            let index = travel.images.indexOf(image);
            travel.images.splice(index, 1);
          }
        }
      }
    }
    // check if there are any new images for upload
    if(req.files) {
      // upload images
      for(const file of req.files) {
        let image = await cloudinary.v2.uploader.upload(file.path);
        // add images to travel.images array
        travel.images.push({
          url: image.secure_url,
          public_id: image.public_id
        });
      }
    }
    // check if location was updated
    if (req.body.travel.location !== travel.location) {
      let response = await geocodingClient
        .forwardGeocode({
          query: req.body.travel.location,
          limit: 1
        })
        .send();
      travel.coordinates = response.body.features[0].geometry.coordinates;
      travel.location = req.body.travel.location;
    }
    // update the travel with any new properties
    travel.title = req.body.travel.title;
    travel.description = req.body.travel.description;
    // save the updated travel into the db
    travel.save();
    // redirect to show page
    res.redirect(`/travels/${travel.id}`);
  },

  async travelDestroy(req, res, next) {
    await Travel.findByIdAndRemove(req.params.id);
    res.redirect('/travels');
  }
}
