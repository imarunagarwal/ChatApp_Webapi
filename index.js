var express = require('express');
var app = express();
var config = require('./server/config/config');
var api = require('./server/api/api');
var logger = require('./server/util/logger');

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
    require('./server/util/seed');
}

//all the middle wares goes here.
require('./server/middleware/appMiddleware')(app);

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


var server = app.listen(config.port);
require('./server/socket')(server);