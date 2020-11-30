const mongoose = require("mongoose"),
        moment = require('moment');
const Schema = mongoose.Schema;

// Create Schema
const TaskSchema = new Schema({
    
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: moment().format('YYYY-MM-DD')
    }
});

var Task = mongoose.model("tasks", TaskSchema);

module.exports =  Task;