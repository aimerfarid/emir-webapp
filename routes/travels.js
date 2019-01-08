var express = require('express');
var router = express.Router();

/* GET travels index /travels */
router.get('/', (req, res, next) => {
  res.send('/travels');
});

/* GET travels new /travels */
router.get('/new', (req, res, next) => {
  res.send('/travels/new');
});

/* POST travels create /travels */
router.get('/', (req, res, next) => {
  res.send('/travels/new');
});

/* GET travels show /travels */
router.get('/', (req, res, next) => {
  res.send('/travels/new');
});

/* GET travels edit /travels */
router.get('/', (req, res, next) => {
  res.send('/travels/new');
});

/* PUT travels update /travels */
router.get('/', (req, res, next) => {
  res.send('/travels/new');
});

/* DELETE travels destroy /travels */
router.get('/', (req, res, next) => {
  res.send('/travels/new');
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
