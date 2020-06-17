const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const PORT = 3001;

const MONGO_URI = "YOUR URI HERE";
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.get('/', (req, res) => {
    res.status(200).send('Nothing to send here.');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} http://localhost:${PORT}/`);
});