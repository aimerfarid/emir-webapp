const Workout = require('../models/workout');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'aimercloud96',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
  async workoutIndex(req, res, next) {
    let workouts = await Workout.find({});
    res.render('workouts/index', { workouts, title: 'Workout Index' });
  },

  workoutNew(req, res, next) {
    res.render('workouts/new');
  },

  async workoutCreate(req, res, next) {
    // create using req.body
    req.body.workout.images = [];
    for (const file of req.files) {
      let image = await cloudinary.v2.uploader.upload(file.path);
      req.body.workout.images.push({
        url: image.secure_url,
        public_id: image.public_id
      });
    }
    let workout = await Workout.create(req.body.workout);
    res.redirect(`/workouts/${workout.id}`);
  },

  async workoutShow(req, res, next) {
    // find the workout
    let workout = await Workout.findById(req.params.id).populate({
      path: 'comments',
      options: { sort: {'_id': -1} },
      populate: {
        path: 'author',
        model: 'User'
      }
    });
    res.render('workouts/show', { workout });
  },

  async workoutEdit(req, res, next) {
    // find the workout
    let workout = await Workout.findById(req.params.id);
    res.render('workouts/edit', { workout });
  },

  async workoutUpdate(req, res, next) {
    // find the workout by id
    let workout = await Workout.findById(req.params.id);
    // check if there's any images for deletion
    if (req.body.deleteImages && req.body.deleteImages.length) {
      // assign deleteImages from req.body to its own variable
      let deleteImages = req.body.deleteImages;
      // loop over deleteImages
      for (const public_id of deleteImages) {
        // delete images from cloudinary
        await cloudinary.v2.uploader.destroy(public_id);
        // delete image from workout.images
        for (const image of workout.images) {
          if (image.public_id === public_id) {
            let index = workout.images.indexOf(image);
            workout.images.splice(index, 1);
          }
        }
      }
    }
    // check if there are any new images for upload
    if(req.files) {
      // upload images
      for(const file of req.files) {
        let image = await cloudinary.v2.uploader.upload(file.path);
        // add images to workout.images array
        workout.images.push({
          url: image.secure_url,
          public_id: image.public_id
        });
      }
    }
    // update the workout with any new properties
    workout.title = req.body.workout.title;
    workout.description = req.body.workout.description;
    workout.reps = req.body.workout.reps;
    workout.sets = req.body.workout.sets;
    // save the updated workout into the db
    workout.save();
    // redirect to show page
    res.redirect(`/workouts/${workout.id}`);
  },

  async workoutDestroy(req, res, next) {
    let workout = await Workout.findById(req.params.id);
    await workout.remove();
    req.session.success = 'Workout removed successfully!';
    res.redirect('/workouts');
  }
}
