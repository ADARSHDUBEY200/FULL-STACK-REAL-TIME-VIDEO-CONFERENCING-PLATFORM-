const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String
    },
    provider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },
    providerId: {
        type: String
    }, // Google or GitHub ID
    avatar: {
        type: String
    },
    createdAt: {
        type: Date, default: Date.now
    }
});

const User = new mongoose.model("User", userSchema);

module.exports = {User};