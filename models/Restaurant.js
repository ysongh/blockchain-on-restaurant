const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter the name of the restaurant"]
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
    },
    deals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Deal'
        }
    ],
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'Owner'
    }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);