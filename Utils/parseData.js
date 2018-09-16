const fs = require('fs');

fs.readFile(__dirname + '/source_data/2013.html', 'utf8', function(err, data) {
	separateDataToRows(data);
});

const separateDataToRows = htmlData => {
	const regex = /\<tr\>/gi;
	let rawData = htmlData.split(regex);

	// create array of columns
	let data = [];
	const td = /\<td\>/gi;
	rawData.forEach(element => {
		let array = element.split(td);
		// save data that has the proper number of columns
		if (array.length === 8) {
			data.push(array);
		}
	});

	// remove non-data headers
	fs.writeFileSync(__dirname + '/data.txt', data);
	return data;
};

module.exports = {
	separateDataToRows,
};
