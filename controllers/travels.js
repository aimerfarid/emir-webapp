const Travel = require('../models/travel');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOXGL_TOKEN });
const { cloudinary } = require('../cloudinary');

module.exports = {
  async travelIndex(req, res, next) {
    let travels = await Travel.paginate({}, {
      page: req.query.page || 1,
      limit: 10,
      sort: '-_id'
    });
    travels.page = Number(travels.page);
    res.render('travels/index', {
      travels,
      mapBoxGLToken: process.env.MAPBOXGL_TOKEN,
      title: 'Travel Index'
    });
  },

  travelNew(req, res, next) {
    res.render('travels/new');
  },

  async travelCreate(req, res, next) {
    // use req.body to create a new travel post
    req.body.travel.images = [];
    for (const file of req.files) {
      req.body.travel.images.push({
        url: file.secure_url,
        public_id: file.public_id
      });
    }
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.travel.location,
        limit: 1
      })
      .send();
    // console.log('RESPONSE: ', response);
    req.body.travel.geometry = response.body.features[0].geometry;
    req.body.travel.author = req.user._id;
    let travel = new Travel(req.body.travel);
		travel.properties.description = `<strong><a href="/travels/${travel._id}">${travel.title}</a></strong><p>${travel.location}</p><p>${travel.description.substring(0, 20)}...</p>`;
		travel.save();
    req.session.success = "Travel created successfully!";
    // console.log(travel);
    // console.log(travel.coordinates);
    res.redirect(`/travels/${travel.id}`);
  },

  async travelShow(req, res, next) {
    // find id
    let travel = await Travel.findById(req.params.id);
    res.render('travels/show', {
      travel,
      mapBoxPublicToken: process.env.MAPBOXDEFAULT_TOKEN
    });
  },

  travelEdit(req, res, next) {
    // find id
    res.render('travels/edit');
  },

  async travelUpdate(req, res, next) {
    // destructure post from res.locals
    const { travel } = res.locals;
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
        // add images to travel.images array
        travel.images.push({
          url: file.secure_url,
          public_id: file.public_id
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
      travel.geometry = response.body.features[0].geometry;
      travel.location = req.body.travel.location;
    }
    // update the travel with any new properties
    travel.title = req.body.travel.title;
    travel.description = req.body.travel.description;
    travel.properties.description = `<strong><a href="/travels/${travel._id}">${travel.title}</a></strong><p>${travel.location}</p><p>${travel.description.substring(0, 20)}...</p>`;
    // save the updated travel into the db
    await travel.save();
    // redirect to show page
    res.redirect(`/travels/${travel.id}`);
  },

  async travelDestroy(req, res, next) {
    const { travel } = res.locals;
    for (const image of travel.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await travel.remove();
    req.session.success = 'Travel Post deleted successfully!';
    res.redirect('/travels');
  }
}
