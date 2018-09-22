require('dotenv').config();
const mongoose = require('mongoose');
const { Person } = require('../models/person');
const { readData } = require('../../Utils/readData');

mongoose.Promise = global.Promise;
mongoose.connect(
	process.env.MONGODB_URI,
	{ useNewUrlParser: true }
);

// readData(2013)
// 	.then(people => {
// 		Person.insertMany(people);
// 		return readData(2014);
// 	})
// 	.then(people => {
// 		Person.insertMany(people);
// 		return readData(2015);
// 	})
// 	.then(people => {
// 		Person.insertMany(people);
// 		return readData(2016);
// 	})
// 	.then(people => {
// 		Person.insertMany(people);
// 		return readData(2017);
// 	})
// 	.then(people => {
// 		Person.insertMany(people);
// 		return readData(2018);
// 	})
// 	.then(people => {
// 		Person.insertMany(people);
// 		console.log('done');
// 	})
// 	.catch(err => console.log(err));

module.exports = {
	mongoose,
};
