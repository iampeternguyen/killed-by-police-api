const mongoose = require('mongoose');
var personSchema = new mongoose.Schema({
	date: Date,
	state: String,
	gender: String,
	race: String,
	name: String,
	age: String,
	photo: String,
	killedBy: Array,
	kbpLink: String,
	newsLink: Array,
});

var Person = mongoose.model('Person', personSchema);

module.exports = {
	Person,
};
