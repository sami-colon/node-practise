const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let News = new Schema({
        title: {
            type: String,
            required : true
        },
        description: {
            type: String, required : true
        },
        url: {
            type: String
        },
        imageUrl: {
            type: String
        },
        publishDate: {
            type: Date
        }
    },
    {collection: "news" }
);

module.exports = model("news", News);
