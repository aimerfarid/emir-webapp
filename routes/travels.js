const express = require('express');
const router = express.Router();

/* GET travels index /travels */
router.get('/', (req, res, next) => {
  res.send('INDEX /travels');
});

/* GET travels new /travels */
router.get('/new', (req, res, next) => {
  res.send('NEW /travels/new');
});

/* POST travels create /travels */
router.post('/', (req, res, next) => {
  res.send('CREATE /travels');
});

/* GET travels show /travels/:id */
router.get('/:id', (req, res, next) => {
  res.send('SHOW /travels/:id');
});

/* GET travels edit /travels/:id/edit */
router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT /travels/:id');
});

/* PUT travels update /travels/:id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /travels/:id');
});

/* DELETE travels destroy /travels/:id */
router.delete('/:id', (req, res, next) => {
  res.send('DESTROY /travels/:id');
});

module.exports = router;

/*
GET     index   /travels
GET     new     /travels/new
POST    create  /travels
GET     show    /travels/:id
GET     edit    /travels/:id/edit
PUT     update  /travels/:id
DELETE  destroy /travels/:id
*/
