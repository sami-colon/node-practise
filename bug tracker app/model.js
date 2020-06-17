const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let Bug = new Schema({
	  Title: {
      type: String
    },
    Description: {
      type: String
    },
    Assignee: {
      type: String
    },
    Date: {
    	type: Date
    },
    Time: {
      type: String
    }
},
{collection: "bug_details" }
);

module.exports = model("BUG", Bug);