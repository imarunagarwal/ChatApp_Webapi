var app = require('./server/server');
var config = require('./server/config/config');

var server = app.listen(config.port);
require('./server/socket')(server);