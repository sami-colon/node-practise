const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cart = require('./model');
const PORT = 3001;
const app = express();
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR API HERE');

app.use(cors({origin: 'http://localhost:3000'}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const MONGO_URI = "YOUR URI HERE";
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

app.post('/addToCart', (req, res) => {
	let d = new Date();
	d = d.toISOString();
	const data = { name: req.body.name, address: req.body.address, email: req.body.email, date: d};
	cart.insertMany(data, (err, result) => {
		if(err){
			res.status(404).send(err);
		} else{
			res.status(200).send("Successfully bought!");
		}
	});
});

app.get('/orderDetails', (req, res) => {
	cart.find({}, (err, result) => {
		if(err){
			res.status(404).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

app.post('/sendEmail', (req, res) => {
	const id = req.body.orderId;
	const status = req.body.status;
	cart.find({}, (err, result) => {
		if(err){
			res.status(404).send(err);
		}else{
			const email = result.filter(ord => ord._id.toString() === id)[0].email;
			const msg = 
					{
  						to: email,
  						from: 'bestone2909@gmail.com',
  						subject: 'Your product status changed',
  						text: status,
  						html: `<strong>Your product has been ${status}</strong>`,
					};
			sgMail.send(msg)
			.then(dta => res.send(dta))
			.catch(err => res.send(err));
		}
	});
});

app.get('/', (req, res) => {
    res.status(200).send('Nothing to send here.');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} http://localhost:${PORT}/`);
});