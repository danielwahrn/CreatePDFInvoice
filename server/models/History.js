const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const HistorySchema = new Schema({
    contractor: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    taskcode: {
        type: String,
    },
    tasktitle: {
        type: String,
    },
    starttime: {
        type: String,
    },
    endtime: {
        type: String,
    },
    hour: {
        type: String,
    },
    lunchtime: {
        type: String,
    },
    date: {
        type: String,
    },
    notes: {
        type: String,
    },
    
});

var History = mongoose.model("Historys", HistorySchema);

module.exports =  History;