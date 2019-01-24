const faker = require('faker');
const Workout = require('./models/workout');
const Blog = require('./models/blog');

async function seedPosts() {
  await Blog.remove({});
  for(const i of new Array(40)) {
         const blog = {
             title: faker.lorem.word(),
             description: faker.lorem.text(),
             category: faker.lorem.word(),
             author: {
              '_id' : '5c42541695bf7954f2bfd73d',
             	'username' : 'aimer'
             }
         }
         await Blog.create(blog);
  }
  console.log('40 new blogs created');
}

module.exports = seedPosts;
