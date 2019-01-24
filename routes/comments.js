const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler, isCommentAuthor } = require('../middleware');
const {
  commentCreate,
  commentUpdate,
  commentDestroy
} = require('../controllers/comments');

/* POST comments create /:id/comments */
router.post('/', asyncErrorHandler(commentCreate));

/* PUT comments update /:id/comments/:comment_id */
router.put('/:comment_id', isCommentAuthor, asyncErrorHandler(commentUpdate));

/* DELETE comments destroy /:id/comments/:comment_id */
router.delete('/:comment_id', isCommentAuthor, asyncErrorHandler(commentDestroy));

module.exports = router;

/*
GET     index   /comments
GET     new     /comments/new
POST    create  /comments
GET     show    /comments/:id
GET     edit    /comments/:id/edit
PUT     update  /comments/:id
DELETE  destroy /comments/:id
*/
