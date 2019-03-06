const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
  asyncErrorHandler,
  isLoggedIn,
  isAdminWebsite,
  isAuthorB
} = require('../middleware');
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
router.get('/new', isLoggedIn, isAdminWebsite, blogNew);

/* POST blogs create /blogs */
router.post('/', isLoggedIn, upload.array('images', 2), asyncErrorHandler(blogCreate));

/* GET blogs show /blogs/:id */
router.get('/:id', asyncErrorHandler(blogShow));

/* GET blogs edit /blogs/:id */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthorB), blogEdit);

/* PUT blogs update /blogs/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthorB), upload.array('images', 2), asyncErrorHandler(blogUpdate));

/* DELETE blogs destroy /blogs/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthorB), asyncErrorHandler(blogDestroy));

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
