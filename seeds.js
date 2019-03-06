const faker = require('faker');
const Blog = require('./models/blog');
const Travel = require('./models/travel');
const Workout = require('./models/workout');
const cities = require('./cities');

async function seedPosts() {
  /* Blogs Seed */
  await Blog.remove({});
  // for(const i of new Array(40)) {
  //        const blog = {
  //            title: faker.lorem.word(),
  //            description: faker.lorem.text(),
  //            category: faker.lorem.word(),
  //            author: '5c5b571eaa9cdd226b4c70ba'
  //        }
  //        await Blog.create(blog);
  // }
  // console.log('40 new blogs created');
  /* Travels Seed */
  await Travel.remove({});
	// for(const i of new Array(100)) {
	// 	const random1000 = Math.floor(Math.random() * 1000);
	// 	const title = faker.lorem.word();
	// 	const description = faker.lorem.text();
	// 	const travelData = {
	// 		title,
	// 		description,
	// 		location: `${cities[random1000].city}, ${cities[random1000].state}`,
	// 		geometry: {
	// 			type: 'Point',
	// 			coordinates: [cities[random1000].longitude, cities[random1000].latitude],
	// 		},
	// 		author: '5c5b571eaa9cdd226b4c70ba'
	// 	}
	// 	let travel = new Travel(travelData);
	// 	travel.properties.description = `<strong><a href="/travels/${travel._id}">${title}</a></strong><p>${travel.location}</p><p>${description.substring(0, 20)}...</p>`;
	// 	travel.save();
	// }
	// console.log('100 new travels created');
  /* Workouts Seed */
  await Workout.remove({});
  // for(const i of new Array(40)) {
  //        const workout = {
  //            title: faker.lorem.word(),
  //            description: faker.lorem.text(),
  //            reps: faker.lorem.word(),
  //            sets: faker.random.number(),
  //            author: '5c5b571eaa9cdd226b4c70ba'
  //        }
  //        await Workout.create(workout);
  // }
  // console.log('40 new workouts created');
}

module.exports = seedPosts;
