const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const { asyncErrorHandler } = require('../middleware');
const {
  travelIndex,
  travelNew,
  travelCreate,
  travelShow,
  travelEdit,
  travelUpdate,
  travelDestroy
} = require('../controllers/travels');

/* GET travels index /travels */
router.get('/', asyncErrorHandler(travelIndex));

/* GET travels new /travels */
router.get('/new', travelNew);

/* POST travels create /travels */
router.post('/', upload.array('images', 10), asyncErrorHandler(travelCreate));

/* GET travels show /travels/:id */
router.get('/:id', asyncErrorHandler(travelShow));

/* GET travels edit /travels/:id/edit */
router.get('/:id/edit', asyncErrorHandler(travelEdit));

/* PUT travels update /travels/:id */
router.put('/:id', upload.array('images', 10), asyncErrorHandler(travelUpdate));

/* DELETE travels destroy /travels/:id */
router.delete('/:id', asyncErrorHandler(travelDestroy));

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
