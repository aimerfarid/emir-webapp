const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({'dest': 'uploads/'});
const { asyncErrorHandler } = require('../middleware');
const {
  blogIndex,
  blogNew,
  blogCreate,
  blogShow,
  blogEdit,
  blogUpdate,
  blogDestroy
} = require('../controllers/blogs');

/* GET blogs index /blogs */
router.get('/', asyncErrorHandler(blogIndex));

/* GET blogs new /blogs */
router.get('/new', blogNew);

/* POST blogs create /blogs */
router.post('/', upload.array('images', 2), asyncErrorHandler(blogCreate));

/* GET blogs show /blogs/:id */
router.get('/:id', asyncErrorHandler(blogShow));

/* GET blogs edit /blogs/:id */
router.get('/:id/edit', asyncErrorHandler(blogEdit));

/* PUT blogs update /blogs/:id */
router.put('/:id', upload.array('images', 2), asyncErrorHandler(blogUpdate));

/* DELETE blogs destroy /blogs/:id */
router.delete('/:id', asyncErrorHandler(blogDestroy));

module.exports = router;

/*
GET     index   /blogs
GET     new     /blogs/new
POST    create  /blogs
GET     show    /blogs/:id
GET     edit    /blogs/:id/edit
PUT     update  /blogs/:id
DELETE  destroy /blogs/:id
*/
