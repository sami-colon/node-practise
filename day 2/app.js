const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const PORT = 6501;
const app = express();

// register miidlewares
app.use(morgan('dev'));

// routings
app.get('/', (req, res, next) => {
	const html = fs.readFileSync('index.html').toString();
	res.send(html);
});

app.listen(PORT, (err) => {
	if(err)
		console.log(err); 
	else
		console.log("Running On Port "+PORT);
});