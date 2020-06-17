const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const BUG = require('./model');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());

const PORT = 3001;

const MONGO_URI = "";
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.get('/', (req, res) => {
    res.status(200).send('Nothing to send here.');
});

app.post('/setBug', (req, res) => {
	const data = {Title: req.body.Title,
				  Description: req.body.Description, 
				  Assignee: req.body.Assignee,
				  Date: new Date().toISOString(),
				  Time: new Date().toLocaleTimeString()
				};
	BUG.insertMany(data, (error, result) => {
		if(error){
			res.status(404).send(err);
		} else{
			res.status(200).send("Successfully Added!");
		}
	});
});

app.get('/getBug', (req, res) => {
	BUG.find({}, (error, result) => {
		if(error){
			res.status(404).send(err);
		} else{
			res.status(200).send(result);
		}
	});
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} http://localhost:${PORT}/`);
});