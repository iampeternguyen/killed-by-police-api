const parseData = require('./parseData');
const expect = require('expect');
const fs = require('fs');
const sampleData = fs.readFileSync(__dirname + '/sampleData.txt', 'utf8');
var peopleArray = [];
describe('Cleanin up data', () => {
	beforeEach(done => {
		fs.readFile(__dirname + '/source_data/2013.html', 'utf8', function(err, data) {
			peopleArray = parseData.getPeopleArray(data);
			done();
		});
	});
	describe('Person', () => {
		var error = '';

		it('should be defined', () => {
			peopleArray.forEach((person, i) => {
				if (!person) {
					error += `person at index ${i} is undefined \n`;
				}
			});
			if (error !== '') {
				throw new Error(error);
			}
		});
	});

	describe('Name', () => {
		var error = '';

		it('it should be a string or null', () => {
			peopleArray.forEach((person, i) => {
				if (person) {
					if (person.name === undefined) {
						error += `person.name at index ${i} is undefined \n`;
					} else if (person.name === null) {
					} else if (typeof person.name !== typeof 'string') {
						error += `person.name at index ${i} is not a string  ${typeof person.name}${person.name}\n`;
					}
				}
			});
			if (error !== '') {
				throw new Error(error);
			}
		});

		it('it should contain no numbers', () => {
			peopleArray.forEach((person, i) => {
				if (person && person.name) {
					if (person.name.match(/\d/gi)) {
						error += `person.name at index ${i} has numbers ${person.name} \n`;
					}
				}
			});
			if (error !== '') {
				throw new Error(error);
			}
		});
	});

	describe('Age', () => {
		var error = '';

		// it('it should be a string or null', () => {
		// 	peopleArray.forEach((person, i) => {
		// 		if (person) {
		// 			if (typeof person.name === undefined) {
		// 				error += `person.name at index ${i} is undefined \n`;
		// 			} else if (person.name === null) {
		// 			} else if (typeof person.name !== typeof 'string') {
		// 				error += `person.name at index ${i} is not a string \n`;
		// 			}
		// 		}
		// 	});
		// 	if (error !== '') {
		// 		throw new Error(error);
		// 	}
		// });

		it('it should be a number', () => {
			peopleArray.forEach((person, i) => {
				if (person && person.age) {
					if (typeof person.age !== typeof 1) {
						error += `person.age at index ${i} is not a number ${person.age} \n`;
					}
				}
			});
			if (error !== '') {
				throw new Error(error);
			}
		});
	});

	describe('Date', () => {
		var error = '';

		it('it should be a valid date', () => {
			peopleArray.forEach((person, i) => {
				if (person && person.date) {
					if (
						person.date.match(/feb/i) ||
						person.date.match(/jan/i) ||
						person.date.match(/mar/i) ||
						person.date.match(/apr/i) ||
						person.date.match(/may/i) ||
						person.date.match(/jun/i) ||
						person.date.match(/jul/i) ||
						person.date.match(/aug/i) ||
						person.date.match(/sep/i) ||
						person.date.match(/oct/i) ||
						person.date.match(/nov/i) ||
						person.date.match(/dec/i)
					) {
					} else {
						error += `person.date at index ${i} is not a valid date ${person.date} \n`;
					}
				}
			});
			if (error !== '') {
				throw new Error(error);
			}
		});
	});
});
