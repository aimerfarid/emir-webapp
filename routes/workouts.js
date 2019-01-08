var express = require('express');
var router = express.Router();

/* GET workouts index /workouts */
router.get('/', (req, res, next) => {
  res.send('/workouts');
});

/* GET workouts new /workouts */
router.get('/new', (req, res, next) => {
  res.send('/workouts/new');
});

/* POST workouts create /workouts */
router.get('/', (req, res, next) => {
  res.send('/workouts/new');
});

/* GET workouts show /workouts */
router.get('/', (req, res, next) => {
  res.send('/workouts/new');
});

/* GET workouts edit /workouts */
router.get('/', (req, res, next) => {
  res.send('/workouts/new');
});

/* PUT workouts update /workouts */
router.get('/', (req, res, next) => {
  res.send('/workouts/new');
});

/* DELETE workouts destroy /workouts */
router.get('/', (req, res, next) => {
  res.send('/workouts/new');
});

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
