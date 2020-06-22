const express = require('express');
const ghUser = require('gh-user');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.get('/userInfo', (req, res) => {
	const username = req.query.username;
	ghUser(username).then(data => res.send(data)).catch(err => res.send(err));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);