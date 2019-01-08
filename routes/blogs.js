var express = require('express');
var router = express.Router();

/* GET blogs index /blogs */
router.get('/', (req, res, next) => {
  res.send('INDEX /blogs');
});

/* GET blogs new /blogs */
router.get('/new', (req, res, next) => {
  res.send('NEW /blogs/new');
});

/* POST blogs create /blogs */
router.post('/', (req, res, next) => {
  res.send('CREATE /blogs');
});

/* GET blogs show /blogs/:id */
router.get('/:id', (req, res, next) => {
  res.send('SHOW /blogs/:id');
});

/* GET blogs edit /blogs/:id */
router.get('/:id/edit', (req, res, next) => {
  res.send('EDIT /blogs/:id/edit');
});

/* PUT blogs update /blogs/:id */
router.put('/:id', (req, res, next) => {
  res.send('UPDATE /blogs/:id');
});

/* DELETE blogs destroy /blogs/:id */
router.delete('/:id', (req, res, next) => {
  res.send('DELETE /blogs/:id');
});

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
