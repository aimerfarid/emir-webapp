const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
  asyncErrorHandler,
  isLoggedIn,
  isAdminWebsite,
  isAuthorW
} = require('../middleware');
const {
  workoutIndex,
  workoutIndexBlog,
  workoutTypes,
  workoutNew,
  workoutCreate,
  workoutShow,
  workoutShowBlog,
  workoutEdit,
  workoutUpdate,
  workoutDestroy
} = require('../controllers/workouts');

/* GET workouts index /workouts */
router.get('/', asyncErrorHandler(workoutIndex));

/* GET health blog index /workouts/blogs */
router.get('/blogs', asyncErrorHandler(workoutIndexBlog));

/* GET types of workout /workouts/types */
router.get('/types', isLoggedIn, workoutTypes);

/* GET workouts new /workouts */
router.get('/new', isLoggedIn, isAdminWebsite, workoutNew);

/* POST workouts create /workouts */
router.post('/', isLoggedIn, upload.array('images', 4), asyncErrorHandler(workoutCreate));

/* GET workouts show /workouts/:id */
router.get('/:id', isLoggedIn, asyncErrorHandler(workoutShow));

/* GET workouts show /workouts/blogs/:id */
router.get('/blogs/:id', isLoggedIn, asyncErrorHandler(workoutShowBlog));

/* GET workouts edit /workouts/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthorW), workoutEdit);

/* PUT workouts update /workouts/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthorW), upload.array('images', 4), asyncErrorHandler(workoutUpdate));

/* DELETE workouts destroy /workouts/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthorW), asyncErrorHandler(workoutDestroy));

module.exports = router;

/*
GET     index   /workouts
GET     new     /workouts/new
POST    create  /workouts
GET     show    /workouts/:id
GET     edit    /workouts/:id/edit
PUT     update  /workouts/:id
DELETE  destroy /workouts/:id
*/
