const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DocketSchema = new Schema({
    docno: {
        type: String,
        default: "0001"
    },
    contractorid: {
        type: String,
        required: true
    },
    contractorname: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    date: {
        type: String,
    },
    path: {
        type: String,
    },
    status: {
        type: String,
        default: 'Waiting'
    },
    notes: {
        type: String,
    },
});

var Docket = mongoose.model("dockets", DocketSchema);

module.exports =  Docket;