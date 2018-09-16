const parseData = require('./parseData');
const expect = require('expect');
const fs = require('fs');
const sampleData = fs.readFileSync(__dirname + '/sampleData.txt', 'utf8');
describe('parseData', () => {
	describe('Separating into rows', () => {
		const testResults = parseData.separateDataToRows(sampleData);
		for (let i = 0; i < testResults.length; i++) {
			it('should separate raw html data into arrays with 7 items', () => {
				expect(testResults[i]).toHaveLength(8);
			});
		}

		it('should have 4 data entries in sample', () => {
			expect(testResults).toHaveLength(4);
		});
	});
});
