const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let User = new Schema({
	  username: {
      type: String,
      unique : true, required : true
    },
    password: {
      type: String, required : true
    },
    role: {
    	type: String, default: 'non-admin'
    }
},
{collection: "user_details" }
);

module.exports = model("user", User);