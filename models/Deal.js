const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DealSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter the name of the deal"]
    },
    price: {
        type: Number,
        required: [true, "Please enter the price of the deal"]
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
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    }
});

module.exports = mongoose.model('Deal', DealSchema);