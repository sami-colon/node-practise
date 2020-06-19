const Schema = require('mongoose').Schema;
const model = require('mongoose').model;
let Product = new Schema({
	  name: {
      type: String,
      urequired : true
    },
    details: {
      type: String, 
      required : true
    },
    price: {
    	type: String, 
      required: true
    }
},
{collection: "product_details" }
);

module.exports = model("product", Product);