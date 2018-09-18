const fs = require('fs');

const getPeopleArray = htmlData => {
	let rawData = separateDataToRows(htmlData);
	let people = organizeData(rawData);
	return people;
};

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
			for (let i = 0; i < array.length; i++) {
				array[i] = array[i].replace(/\<\/td\>/gi, '');
			}
			data.push(array);
		}
	});

	// remove non-data table header
	data.splice(0, 1);

	//writing data array to file
	var file = fs.createWriteStream(__dirname + '/data.txt');
	file.on('error', function(err) {
		/* error handling */
	});
	data.forEach(item => {
		file.write(item.join(', ') + '\n');
	});
	file.end();

	return data;
};

const getNumberOfEntriesInRow = e => {
	// check to see if there is more than one person in row
	let size = /<br>/gi.exec(e[1]);
	if (size) {
		return size.length + 1;
	} else {
		return 1;
	}
};

const organizeData = data => {
	let people = [];
	data.forEach(e => {
		if (getNumberOfEntriesInRow(e) === 1) {
			let person = getKBPDataObject(e);
			if (person) {
				people.push(person);
			}
		} else {
			var peopleData = separateData(e, getNumberOfEntriesInRow(e));
			peopleData.forEach((element, i) => {
				let person = getKBPDataObject(element);
				if (person) {
					people.push(person);
				}
			});
		}
	});

	return people;
};

const getKBPDataObject = element => {
	var sizeOfElement = getNumberOfEntriesInRow(element);
	if (sizeOfElement === 1) {
		return processedObject(element);
	}
};

const processedObject = e => {
	// get date information
	let regex = /(?:<center>)*(?:\(.*\))*\s*([A-Z].*\d+)/g;
	let match = regex.exec(e[1]);
	if (!match) {
		return null;
	}
	let date = match[1];

	if (!validateDate(date)) {
		return false;
	}

	// organize state
	let state = e[2].match(/\w+/)[1];

	// organize race and gender
	let gender;
	let race;

	// check to see if cell has both race/gender info
	match = e[3].split('/');
	if (match.length === 2) {
		gender = match[0];
		race = match[1];
	} else if (match.length === 1) {
		match = match[0].replace(/\s*/g, '');
		if (!match == '') {
			gender = match;
		}
	}

	if (race) {
		race = race.trim();
	}
	if (gender) {
		gender = gender.trim();
	}

	// parse name age cell some cells also has photo link
	let name;
	let age;
	let photo;

	let nameAgePhotoObject = getNameAgePhotoObject(e[4]);

	name = nameAgePhotoObject.name;
	age = nameAgePhotoObject.age;
	photo = nameAgePhotoObject.photo;

	// organize kill by data
	let killedBy = [];

	match = e[5].replace(/<(?:.|\n)*?>/gm, '');
	// some people killed by more than one reason
	for (let i = 0; i < match.length; i++) {
		if (match[i].match(/\w/i)) {
			killedBy.push(match[i]);
		}
	}

	// get kbpLink

	match = e[6].split('"'); ///<a.*? href=\"(.*?)\".*?<\/a>/g test this later
	let kbpLink = match[1];
	if (e[6].includes('href')) {
		kbpLink = /href="(.*?)"/.exec(e[6])[1];
	}
	// get news link
	match = e[7].split('"');

	let newsLink = [];
	if (e[7].includes('href')) {
		match = e[7].match(/href="(.*?)"/g);
		if (match) {
			match.forEach(element => {
				newsLink.push(/href="(.*?)"/g.exec(element)[1]);
			});
		}
	}

	// save data
	return {
		date,
		state,
		gender,
		race,
		name,
		age,
		photo,
		killedBy,
		kbpLink,
		newsLink,
	};
};

const getNameAgePhotoObject = e => {
	let regexHtmlTags = /<(?:.|\n)*?>/gm;
	let regexLastComma = /\,(?=[^,]*$)/;
	let regexLastPeriod = /\.(?=[^.]*$)/;
	let nameAgeField = e.replace(regexHtmlTags, '');

	let name, age, photo;

	let hasCommaInName = nameAgeField.match(/,/);
	let hasPeriodInName = nameAgeField.match(/\./);
	let hasAgeInName = nameAgeField.match(/\d/);

	if (hasCommaInName && hasAgeInName) {
		match = nameAgeField.split(regexLastComma);
		// special case where entries have comma at end of nameagefield
		let stillHasCommaInName = match[0].match(/,/);
		let stillHasNumberInName = match[0].match(/\d/);
		if (stillHasCommaInName && stillHasNumberInName) {
			match = match[0].split(regexLastComma);
			name = match[0];
			age = match[1];
		} else {
			name = match[0];
			age = match[1];
		}
	} else if (hasPeriodInName && hasAgeInName) {
		match = nameAgeField.split(regexLastPeriod);
		name = match[0];
		age = match[1];
	} else if (hasAgeInName) {
		let ageOnlyInField = nameAgeField.trim().match(/^\d/);
		if (ageOnlyInField) {
			age = nameAgeField;
			name = null;
		} else {
			match = /(\D+)(\d+)/gi.exec(nameAgeField);
			if (match.length == 3) {
				name = match[1].trim();
				age = match[2].trim();
			}
		}
	} else if (!hasAgeInName) {
		name = nameAgeField;
	}

	if (name) {
		name = name.trim();
	}
	if (age) {
		age = age.trim();
		// clean up age
		if (Number(age)) {
			age = Number(age);
		} else {
			// special case where age is followed by aka
			// special case where age is followed by preg
			// special case where age is followed by space and ""
			if (
				/\da/i.exec(age) ||
				/\dp/i.exec(age) ||
				/\d\"/.exec(age) ||
				/\d\s\"/.exec(age) ||
				/\db/i.exec(age) ||
				/\df/i.exec(age) ||
				/\d\s\(/i.exec(age)
			) {
				age = age.match(/\d+/)[0];
			}

			if (Number(age)) {
				age = Number(age);
			}
		}
	}

	if (e.includes('href')) {
		photo = /href="(.*?)"/.exec(e)[1];
	}

	return {
		name,
		age,
		photo,
	};
};

const validateDate = date => {
	if (
		date.match(/feb/i) ||
		date.match(/jan/i) ||
		date.match(/mar/i) ||
		date.match(/apr/i) ||
		date.match(/may/i) ||
		date.match(/jun/i) ||
		date.match(/jul/i) ||
		date.match(/aug/i) ||
		date.match(/sep/i) ||
		date.match(/oct/i) ||
		date.match(/nov/i) ||
		date.match(/dec/i)
	) {
		return true;
	} else {
		return false;
	}
};

const separateData = (e, size) => {
	let temp;
	for (let i = 0; i <= 7; i++) {
		temp = e[i];

		// some columns didn't duplicate data for each person in row
		// this part duplicates that data

		if (i == 0 || i == 2 || i == 5 || i == 6 || i == 7) {
			e[i] = [];
			for (let j = 0; j < size; j++) {
				// data was not uniform, some cells have duplicate data others don't
				// this part checks if there is duplicate information where none is expected and separates it
				if (temp.search(/<br>/gi)) {
					temp = temp.split(/<br>/gi);
					temp = temp[0];
				}
				// rebuild the array with duplicate data
				e[i].push(temp);
			}
		} else {
			// separates the data that should have different information
			e[i] = temp.split(/<br>/gi);
		}
	}

	// rebuild an array for each person that was in one row

	let peopleArray = [[], []];
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < e.length; j++) {
			peopleArray[i][j] = e[j][i];
		}
	}

	return peopleArray;
};

module.exports = {
	getPeopleArray,
};
