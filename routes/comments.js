const express = require('express');
const router = express.Router({ mergeParams: true });

/* POST comments create /:id/comments */
router.post('/', (req, res, next) => {
  res.send('CREATE /comments');
});

/* PUT comments update /:id/comments/:comment_id */
router.put('/:comment_id', (req, res, next) => {
  res.send('UPDATE /comments/:id');
});

/* DELETE comments destroy /:id/comments/:comment_id */
router.delete('/:comment_id', (req, res, next) => {
  res.send('DELETE /comments/:id');
});

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
