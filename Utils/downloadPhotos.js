const path = require('path');
const fs = require('fs');
const download = require('image-downloader');

const { readData } = require('./readData');

readData(2014)
	.then(people => {
		let mediaFolder = path.join(__dirname, '../media');

		let currentPhotos;
		fs.readdir(mediaFolder, (err, files) => {
			if (err) {
				return console.log(err);
			}
			currentPhotos = files;

			people.forEach(person => {
				if (person.photo) {
					let regexFileName = /\/([^\/]*$)/;
					let fileName = person.photo.match(regexFileName)[1];

					if (currentPhotos.indexOf(fileName) === -1) {
						const options = {
							url: person.photo,
							dest: mediaFolder, // Save to /path/to/dest/image.jpg
						};
						setTimeout(() => {
							download
								.image(options)
								.then(({ filename, image }) => {
									console.log('File saved to', filename);
								})
								.catch(err => {
									console.error(err);
								});
						}, 600);
					}
				}
			});
		});
	})
	.catch(err => console.log(err));
