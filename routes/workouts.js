const express = require('express');
const router = express.Router();

/* GET workouts index /workouts */
router.get('/', (req, res, next) => {
  res.send('INDEX /workouts');
});

/* GET workouts new /workouts */
router.get('/new', (req, res, next) => {
  res.send('NEW /workouts/new');
});

/* POST workouts create /workouts */
router.post('/', (req, res, next) => {
  res.send('CREATE /workouts');
});

/* GET workouts show /workouts/:id */
router.get('/', (req, res, next) => {
  res.send('SHOW /workouts/:id');
});

/* GET workouts edit /workouts/:id/edit */
router.get('/', (req, res, next) => {
  res.send('EDIT /workouts/:id/edit');
});

/* PUT workouts update /workouts/:id */
router.put('/', (req, res, next) => {
  res.send('UPDATE /workouts/:id');
});

/* DELETE workouts destroy /workouts/:id */
router.delete('/', (req, res, next) => {
  res.send('DELETE /workouts/:id');
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
