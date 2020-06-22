const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let User = new Schema({
        name: {
            type: String,
            required : true
        },
        email: {
            type: String, required : true, unique: true
        },
        password: {
            type: String
        }
    },
    {collection: "users" }
);

module.exports = model("user", User);
