const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter the name of the restaurant"]
    },
    price: {
        type: Number,
        required: [true, "Please enter the price of the deal"]
    },
    location: {
        type: String,
        required: [true, "Please enter the location of the restaurant"]
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);