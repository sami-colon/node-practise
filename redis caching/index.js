const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");
const bodyParser = require("body-parser");
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 5000;
const redis_client = redis.createClient(port_redis);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const checkCache = (req, res, next) => {
    const id = 1;
    redis_client.get(id, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
};

app.get('/', checkCache, (req, res) => {
    fetch('https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=INDIA')
        .then(data => data.json())
        .then(result => {
            redis_client.setex(1, 3600, JSON.stringify(result));
            res.send(result);
        })
        .catch(err => res.send(err));
});

app.listen(port, () => console.log(`Server running on Port ${port}`));