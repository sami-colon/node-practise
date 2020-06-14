const express = require('express');
const app = express();
const request = require('request');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    request('http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees', function(error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        res.send(JSON.parse(body));
    });
});

app.listen(3001, () => console.log(`listening on port 3001`));