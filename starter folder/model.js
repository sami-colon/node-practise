const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let Bug = new Schema({
	  name: {
      type: String
    },
    address: {
      type: String
    },
    email: {
      type: String
    },
    date: {
    	type: Date
    }
},
{collection: "bug_details" }
);

module.exports = model("bug", Bug);