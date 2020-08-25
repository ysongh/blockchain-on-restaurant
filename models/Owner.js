const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
    restaurants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    ]
});

module.exports = mongoose.model('Owner', OwnerSchema);