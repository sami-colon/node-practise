const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('./config');
const usermodel = require('./model');
const productmodel = require('./productModel');

const localStorage = new LocalStorage('./scratch');
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001;

const MONGO_URI = config.MONGO_URI;
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

const isAdmin = (req, res, next) => {
    const token = localStorage.getItem('token');
    if (!token) {
        res.redirect('/?error=' + encodeURIComponent('!Not logged in'));
    } else {
        jwt.verify(token, config.SECRET_KEY, (error, decoded) => {
            if (error) res.redirect('/?error=' + encodeURIComponent('!Not logged in'));
            else {
                usermodel.findOne({ _id: decoded.id }, (err, user) => {
                    if (err) res.redirect('/?error=' + encodeURIComponent('!server error. Cannot authentcate'));
                    else if (!user) res.redirect('/?error=' + encodeURIComponent('!No such user present'));
                    else if (user.role !== 'admin') res.redirect('/?error=' + encodeURIComponent('!You are not authorised to access this page'));
                    else next();
                });
            }
        });
    }
}

app.get('/', (req, res) => {
    res.render('login', { error: req.query.error ? req.query.error : '' });
});

app.get('/shopping', (req, res) => {
    const token = localStorage.getItem('token');
    if (!token) {
        res.redirect('/?error=' + encodeURIComponent('!Not logged in'));
    } else {
        jwt.verify(token, config.SECRET_KEY, (error, decoded) => {
            if (error) res.redirect('/?error=' + encodeURIComponent('!Not logged in'));
            else {
                usermodel.findOne({ _id: decoded.id }, (err, user) => {
                    if (err) res.redirect('/?error=' + encodeURIComponent('!server error. Cannot authentcate'));
                    else if (!user) res.redirect('/?error=' + encodeURIComponent('!No such user present'));
                    else {
                        productmodel.find({}, (error, result) => {
                            if (error) res.send(error);
                            else res.render('shoping', { data: result });;
                        });
                    }
                });
            }
        });
    }
});

app.get('/admin', isAdmin, (req, res) => {
    res.render('admin', { error: req.query.error ? req.query.error : '', msg: req.query.msg ? req.query.msg : '' });
});

app.get('/userList', isAdmin, (req, res) => {
    usermodel.find({}, (error, result) => {
        if (error) res.send(error);
        else res.send(result);
    });
});

app.get('/productList', (req, res) => {
    productmodel.find({}, (error, result) => {
        if (error) res.send(error);
        else res.send(result);
    });
});

app.get('/logout', (req, res) => {
    localStorage.removeItem('token');
    res.send({ result: true });
});

app.post('/register', (req, res) => {
    const data = { username: req.body.username, password: bcrypt.hashSync(req.body.password, 8) };
    usermodel.create(data, (error, result) => {
        if (error) res.redirect('/?error=' + encodeURIComponent('!There was error registering user'));
        else if (!result) {
            res.redirect('/?error=' + encodeURIComponent('!Username alreday taken'));
        } else {
            const token = jwt.sign({ id: result._id }, config.SECRET_KEY, { expiresIn: 86400 });
            localStorage.setItem('token', token);
            res.redirect('/shopping');
        }
    });
});

app.post('/add_user', isAdmin, (req, res) => {
    const data = { username: req.body.username, password: bcrypt.hashSync(req.body.password, 8), role: req.body.role };
    usermodel.create(data, (error, result) => {
        if (error) res.redirect('/admin?error=' + encodeURIComponent('!There was error registering user'));
        else if (!result) {
            res.redirect('/admin?error=' + encodeURIComponent('!Username alreday taken'));
        } else {
            res.redirect('/admin?msg=' + encodeURIComponent('!Succesfully added'));
        }
    });
});

app.post('/add_product', isAdmin, (req, res) => {
    const data = { name: req.body.pname, details: req.body.details, price: req.body.price };
    productmodel.create(data, (error, result) => {
        if (error) res.redirect('/admin?error=' + encodeURIComponent('!There was error adding product'));
        else if (!result) {
            res.redirect('/admin?error=' + encodeURIComponent('!Server error'));
        } else {
            res.redirect('/admin?msg=' + encodeURIComponent('!Succesfully added'));
        }
    });
});

app.post('/login', (req, res) => {
    usermodel.findOne({ username: req.body.username }, (error, result) => {
        if (error) res.redirect('/?error=' + encodeURIComponent('!Server error'));
        else if (!result) {
            res.redirect('/?error=' + encodeURIComponent('!Please Enter valid username'));
        } else {
            const compRes = bcrypt.compareSync(req.body.password, result.password);
            if (!compRes) res.redirect('/?error=' + encodeURIComponent('!Please Enter valid password'));
            else {
                const token = jwt.sign({ id: result._id }, config.SECRET_KEY, { expiresIn: 86400 });
                localStorage.setItem('token', token);
                if (result.role === 'admin')
                    res.redirect('/admin');
                else
                    res.redirect('/shopping');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} http://localhost:${PORT}/`);
});