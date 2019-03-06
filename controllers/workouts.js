const Workout = require('../models/workout');
const { cloudinary } = require('../cloudinary');

module.exports = {
  async workoutIndex(req, res, next) {
    let workouts = await Workout.paginate({}, {
      page: req.query.page || 1,
      limit: 10,
      sort: '-_id'
    });
    workouts.page = Number(workouts.page);
    res.render('workouts/index', {
      workouts,
      title: 'Workout Index'
    });
  },

  async workoutIndexBlog(req, res, next) {
    let workouts = await Workout.paginate({}, {
      page: req.query.page || 1,
      limit: 10,
      sort: '-_id'
    });
    workouts.page = Number(workouts.page);
    res.render('workouts/index-blog', {
      workouts,
      title: 'Health Blogs'
    });
  },

  workoutTypes(req, res, next) {
    res.render('workouts/types');
  },

  workoutNew(req, res, next) {
    res.render('workouts/new');
  },

  async workoutCreate(req, res, next) {
    // create using req.body
    req.body.workout.images = [];
    for (const file of req.files) {
      req.body.workout.images.push({
        url: file.secure_url,
        public_id: file.public_id
      });
    }
    req.body.workout.author = req.user._id;
    let workout = await Workout.create(req.body.workout);
    if (workout.type === 'Blog') {
      res.redirect(`/workouts/blogs/${workout.id}`);
    } else {
      res.redirect(`/workouts/${workout.id}`);
    }
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
    const floorRating = workout.calculateAvgRating();
    res.render('workouts/show', { workout, floorRating });
  },

  async workoutShowBlog(req, res, next) {
    // find the workout
    let workout = await Workout.findById(req.params.id).populate({
      path: 'comments',
      options: { sort: {'_id': -1} },
      populate: {
        path: 'author',
        model: 'User'
      }
    });
    const floorRating = workout.calculateAvgRating();
    res.render('workouts/show-blog', { workout, floorRating });
  },

  workoutEdit(req, res, next) {
    res.render('workouts/edit');
  },

  async workoutUpdate(req, res, next) {
    // destructure post from res.locals
    const { workout } = res.locals;
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
        // add images to workout.images array
        workout.images.push({
          url: file.secure_url,
          public_id: file.public_id
        });
      }
    }
    // update the workout with any new properties
    workout.title = req.body.workout.title;
    workout.description = req.body.workout.description;
    workout.type = req.body.workout.type;
    workout.category = req.body.workout.category;
    workout.reps = req.body.workout.reps;
    workout.sets = req.body.workout.sets;
    // save the updated workout into the db
    await workout.save();
    // redirect to show page
    res.redirect(`/workouts/${workout.id}`);
  },

  async workoutDestroy(req, res, next) {
    const { workout } = res.locals;
    for (const image of workout.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await workout.remove();
    req.session.success = 'Workout Post removed successfully!';
    res.redirect('/workouts');
  }
}
