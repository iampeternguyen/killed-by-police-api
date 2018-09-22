const { mongoose } = require('./db/mongoose');
const { Person } = require('./models/person');

const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

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
