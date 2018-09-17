const parseData = require('./Utils/parseData');
const fs = require('fs');
fs.readFile(__dirname + '/Utils/source_data/2013.html', 'utf8', function(err, data) {
	var people = parseData.getPeopleArray(data);
	fs.writeFileSync('dataprocessed.json', JSON.stringify(people, null, 2));
});
