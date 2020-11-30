const mongoose = require("mongoose"),
        moment = require('moment');
const Schema = mongoose.Schema;

// Create Schema
const AdminSchema = new Schema({
   username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    date: {
        type: String,
        default: moment().format('YYYY-MM-DD')
    }
});

var Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin