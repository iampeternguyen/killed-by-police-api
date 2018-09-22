const fs = require('fs');
const parseData = require('./parseData');
const readData = year => {
	return new Promise((resolve, reject) => {
		fs.readFile(__dirname + `/source_data/${year}.html`, 'utf8', function(err, data) {
			var people = parseData.getPeopleArray(data);
			if (people) {
				resolve(people);
			} else {
				reject('Cannot load data from ' + year);
			}
		});
	});
};

module.exports = {
	readData,
};
