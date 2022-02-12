
const express = require('express'),
    auth = require('./auth'),
    contractor = require('./contractor'),
    admin = require('./admin');

    const app = express();

    app.use('/contractor', contractor)
    app.use('/admin', admin)
    app.use('/auth', auth)

 module.exports = app;
