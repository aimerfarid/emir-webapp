const Blog = require('../models/blog');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'aimercloud96',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
  async blogIndex(req, res, next) {
    let blogs = await Blog.paginate({}, {
      page: req.query.page || 1,
      limit: 10
    });
    blogs.page = Number(blogs.page);
    res.render('blogs/index', { blogs, title: 'Blog Index' });
  },

  blogNew(req, res, next) {
    res.render('blogs/new');
  },

  async blogCreate(req, res, next) {
    req.body.blog.images = [];
    for(const file of req.files) {
      let image = await cloudinary.v2.uploader.upload(file.path);
      req.body.blog.images.push({
        url: image.secure_url,
        public_id: image.public_id
      });
    }
    let blog = await Blog.create(req.body.blog);
    req.session.success = 'Blog created successfully!';
    res.redirect(`/blogs/${blog.id}`);
  },

  async blogShow(req, res, next) {
    let blog = await Blog.findById(req.params.id);
    res.render('blogs/show', { blog });
  },

  async blogEdit(req, res, next) {
    let blog = await Blog.findById(req.params.id);
    res.render('blogs/edit', { blog });
  },

  async blogUpdate(req, res, next) {
    // find the blog by id
    let blog = await Blog.findById(req.params.id);
    // check if there's any images for deletion
    if (req.body.deleteImages && req.body.deleteImages.length) {
      // assign deleteImages from req.body to its own variable
      let deleteImages = req.body.deleteImages;
      // loop over deleteImages
      for (const public_id of deleteImages) {
        // delete images from cloudinary
        await cloudinary.v2.uploader.destroy(public_id);
        // delete image from blog.images
        for (const image of blog.images) {
          if (image.public_id === public_id) {
            let index = blog.images.indexOf(image);
            blog.images.splice(index, 1);
          }
        }
      }
    }
    // check if there are any new images for upload
    if(req.files) {
      // upload images
      for(const file of req.files) {
        let image = await cloudinary.v2.uploader.upload(file.path);
        // add images to blog.images array
        blog.images.push({
          url: image.secure_url,
          public_id: image.public_id
        });
      }
    }
    // update the blog with any new properties
    blog.title = req.body.blog.title;
    blog.description = req.body.blog.description;
    blog.category = req.body.blog.category;
    // save the updated blog into the db
    blog.save();
    // redirect to show page
    res.redirect(`/blogs/${blog.id}`);
  },

  async blogDestroy(req, res, next) {
    let blog = await Blog.findById(req.params.id);
    for (const image of blog.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await blog.remove();
    res.redirect('/blogs');
  }
}
