
const express = require('express'),
    auth = require('./auth'),
    contractor = require('./contractor'),
    admin = require('./admin');

    const app = express();

    // Have Node serve the files for our built React app
    app.use(express.static(path.resolve(__dirname, '../')));

    app.use('/contractor', contractor)
    app.use('/admin', admin)
    app.use('/auth', auth)

    // All other GET requests not handled before will return our React app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../', 'index.html'));
    });

 module.exports = app;
