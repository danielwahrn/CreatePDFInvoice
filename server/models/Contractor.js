const mongoose = require("mongoose"),
        moment = require('moment');
const Schema = mongoose.Schema;

// Create Schema
const ContractorSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
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
    jobsite: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: moment().format('YYYY-MM-DD')
    }
});

var Contractor = mongoose.model("contractors", ContractorSchema);

module.exports = Contractor;