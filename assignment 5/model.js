const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let Cart = new Schema({
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
{collection: "cart_details" }
);

module.exports = model("cart", Cart);