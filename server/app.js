
const express = require('express'),
    cors = require('cors'),
    compression = require('compression'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    path = require('path'),
    db = require('./db'),
    api = require('./api');

const port = process.env.PORT || 8001,
    host = process.env.HOST || "localhost";

const app = express();

app.use(cors())
app.use(compression())
app.use(morgan('dev'))
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Have Node serve the files for our built React app
app.use('*', express.static(path.resolve(__dirname, '../front/build')));

app.use('/api', api);
// app.use('./db', db);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../front/build', 'index.html'));
});

app.listen(port, host);

console.log('server listening on http://%s:%d', host, port)