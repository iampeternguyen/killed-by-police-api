const { mongoose } = require('./db/mongoose');
const { Person } = require('./models/person');

const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();
app.get('/', (req, res) => {
	res.send(
		`API to get data from killedbypolice.net. <br>
		This project scraped data from that site to make it easily retrievable for other uses. <br>
		To use send /GET request to /data for all data or /data/year to retreive data for a specific year.<br>
		Data exists from 2013-2018.<br>
		Please note that request all data from /data may take a long time to load. <br><br>
		Source for the project can be found here: https://github.com/iampeternguyen/killed-by-police-api

		`
	);
});

app.get('/data/', (req, res) => {
	let year = req.params.year;
	Person.find()
		.then(people => {
			res.send(people);
		})
		.catch(err => res.status(404).send(`Cannot find data for year ${year}`));
});

app.get('/data/:year', (req, res) => {
	let year = req.params.year;
	Person.find({
		date: {
			$gte: new Date(`January 1, ${year}`),
			$lte: new Date(`December 31, ${year}`),
		},
	})
		.then(people => {
			res.send(people);
		})
		.catch(err => res.status(404).send(`Cannot find data for year ${year}`));
});

app.listen(PORT, () => {
	console.log(`Now listening on port ${PORT}`);
});
