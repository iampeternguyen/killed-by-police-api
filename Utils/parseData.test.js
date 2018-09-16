const parseData = require('./parseData');
const expect = require('expect');
const fs = require('fs');
const sampleData = fs.readFileSync(__dirname + '/sampleData.txt', 'utf8');
describe('parseData', () => {
	describe('Separating into rows', () => {
		const testResults = parseData.separateDataToRows(sampleData);
		it('should separate raw html data into arrays with 8 items', () => {
			let err = '';
			testResults.forEach((element, i) => {
				if (element.length !== 8) {
					err += `element at index ${i} has ${element.length} items`;
				}
			});

			if (err == '') {
				return true;
			} else {
				throw new Error(err);
			}
		});

		it('should have 3 data entries in sample', () => {
			expect(testResults).toHaveLength(3);
		});

		it('should only have one entry per row', () => {
			let err = '';
			testResults.forEach((element, i) => {
				let size = /<br>/gi.exec(element[1]);
				if (size) {
					err += `element at index ${i} has ${size.length + 1} entries`;
				}
			});

			if (err == '') {
				return true;
			} else {
				throw new Error(err);
			}
		});
	});
});
