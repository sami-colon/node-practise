const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('./config');
const newsmodel = require('./models/news');
const path = require('path');
const http = require('http');
const publicip = require('public-ip');
const iplocate = require('node-iplocate');
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');


const localStorage = new LocalStorage('./scratch');
sgMail.setApiKey(config.SENDGRID);
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MONGO_URI = config.MONGO_URI;
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

let server = http.createServer(app).listen(config.PORT, () => {
    console.log(`listening on port ${config.PORT}`);
});

let io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {

	socket.on('nickname', (nickname) => {
		socket.nickname = nickname;
	});

	socket.on('message', (data) => {
		publicip.v4().then(ip => {
			iplocate(ip).then((res) => {
				const city = JSON.stringify(res.city, null, 2);
				const user = socket.nickname ? socket.nickname : 'anonymous';
				socket.emit('newmessage', { message: data.message, sender: user, city: city});
				socket.broadcast.emit('newmessage', { message: data.message, sender: user, city: city});
			});
		});
	});
});

app.get('/', (req, res) => {
	publicip.v4().then(ip => {
		iplocate(ip).then((result) => {
			const city = JSON.stringify(result.city, null, 2);
			const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.slice(1, -1)}&appid=${config.WEATHER_API}&units=metric`;
			fetch(weatherUrl).then(d => d.json()).then(data => {
				fetch(`http://localhost:3000/getLatestNews`).then(_d => _d.json()).then(_data =>
					res.render('index', {weather: data, latestNews: _data.slice(0, _data.length>3?3:_data.length), news: _data})
				)
					.catch(_err => {
						console.log(_err);
						res.render('index', {weather: data});
					});
			}).catch(err => {
				console.log(err);
				res.render('index')
			});
		});
	});
});

app.get('/aboutus', (req, res) => {
	res.render('aboutus');
});

app.get('/contactus', (req, res) => {
	res.render('contactus',{ error: req.query.error ? req.query.error : '', msg: req.query.msg ? req.query.msg : '' });
});

app.get('/sports', (req, res) => {
	res.render('sports');
});

app.get('/addNews', (req, res) => {
	res.render('addNews', { error: req.query.error ? req.query.error : '', msg: req.query.msg ? req.query.msg : '' });
});

app.post('/addNews', (req, res) => {
	const data = { title: req.body.title, description: req.body.description, url: req.body.url, imageUrl: req.body.imageUrl, publishDate: new Date().toISOString()};
	newsmodel.create(data, (error, result) => {
		if (error) res.redirect('/addNews?error=' + encodeURIComponent('!There was error adding news'));
		else if (!result) {
			res.redirect('/addNews?error=' + encodeURIComponent('!DB Server error'));
		} else {
			res.redirect('/addNews?msg=' + encodeURIComponent('!Succesfully added'));
		}
	});
});

app.get('/getLatestNews', (req, res) => {
	newsmodel.find({}).sort('-publishDate').exec((error, result) => {
		if(error) console.log(error);
		else {
			console.log(result);
			res.send(result);
		}
	});
});

app.post('/contactus', (req, res) => {
	const sender = req.body.sender;
	const query = req.body.query;
	const msg =
		{
			to: 'bestonc2909@gmail.com',
			from: 'bestone2909@gmail.com',
			subject: 'New query received',
			text: query,
			html: `<strong>${sender}: </strong> ${query}`,
		};
	sgMail.send(msg)
		.then(dta => {
			res.redirect('/contactus?msg=' + encodeURIComponent('!Succesfully sent'));
		})
		.catch(err => {
			res.redirect('/contactus?error=' + encodeURIComponent('!Error occured while sending.'));
		});
});
