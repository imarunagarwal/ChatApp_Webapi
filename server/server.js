var express = require('express');
var api = require('./api/api');
var app = express();
var config = require('./config/config');
var logger = require('./util/logger');
const path = require('path');

// connection with the db
require('mongoose')
    .connect(config.db.url,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    .then(() => logger.log('DB Connected!'))
    .catch(err => logger.error('DB Connection Error: '+ err.message));

if (config.seed) {
    require('./util/seed.js');
}

//all the middle wares goes here.
require('./middleware/appMiddleware')(app);

// to remove /server from the directory path.
let str = __dirname;
str = str.substring(0, str.length - 7);

app.use('/api', api);

app.use(function (err, req, res, next) {
    // if error thrown from jwt validation check
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token');
        return;
    }
    logger.error(err.stack);
    res.status(500).send('Oops Internal Server Error');
});

module.exports = app;