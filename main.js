const parseData = require('./Utils/parseData');
const fs = require('fs');
fs.readFile(__dirname + '/Utils/source_data/2013.html', 'utf8', function(err, data) {
	let rawDataArray = parseData.separateDataToRows(data);
	parseData.organizeData2(rawDataArray);
});
