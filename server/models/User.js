const mongoose = require("mongoose"),
        moment = require('moment');

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    token: {
        type: String
    },
    date: {
        type: String,
        default: moment().format('YYYY-MM-DD')
    }
});

var User = mongoose.model("users", UserSchema);

module.exports = User