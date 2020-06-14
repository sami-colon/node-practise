const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

const PORT = 6500;
const data = JSON.parse(fs.readFileSync('data.json').toString());

app.use(morgan('dev'));

app.get('/', (req, res, next) => {
	res.send('<h1>Welcome</h1>');
});

app.get('/data', (req, res, next) => {
	res.send(data);
});

app.listen(PORT, (err) => {
	if(err) {
		console.log('Error Occured');
		process.exit(-4);
	}
	console.log(`listening on http://localhost:${PORT}`);
	console.log('Use /data to get data');
});
