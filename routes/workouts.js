const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const { asyncErrorHandler } = require('../middleware');
const {
  workoutIndex,
  workoutNew,
  workoutCreate,
  workoutShow,
  workoutEdit,
  workoutUpdate,
  workoutDestroy
} = require('../controllers/workouts');

/* GET workouts index /workouts */
router.get('/', asyncErrorHandler(workoutIndex));

/* GET workouts new /workouts */
router.get('/new', workoutNew);

/* POST workouts create /workouts */
router.post('/', upload.array('images', 4), asyncErrorHandler(workoutCreate));

/* GET workouts show /workouts/:id */
router.get('/:id', asyncErrorHandler(workoutShow));

/* GET workouts edit /workouts/:id/edit */
router.get('/:id/edit', asyncErrorHandler(workoutEdit));

/* PUT workouts update /workouts/:id */
router.put('/:id', upload.array('images', 4), asyncErrorHandler(workoutUpdate));

/* DELETE workouts destroy /workouts/:id */
router.delete('/:id', asyncErrorHandler(workoutDestroy));

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
