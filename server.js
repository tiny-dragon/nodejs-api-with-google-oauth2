var express = require('express');
var bodyParser = require('body-parser');

var settings = require('./config/settings');
var route = require('./config/routes');
const winston = require('winston')

var app = express();

var options = {
    file: {
      level: 'info',
      filename: `server.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
};

const consoleTransport = new winston.transports.Console(options.console);
const fileTransport = new winston.transports.File(options.file);

const myWinstonOptions = {
    transports: [
        consoleTransport,
        fileTransport
    ],
    exitOnError: false,
}
const logger = new winston.createLogger(myWinstonOptions)

function logRequest(req, res, next) {
    logger.info(req.url)
    next()
}
// app.use(logRequest)

function logError(err, req, res, next) {
    logger.error(err);
    
    next()
}
app.use(logError)

// Add headers
app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Setting up Views
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use('/', route);

var server = app.listen(settings.port, function(err) {
    if (!err)
        console.log('listening on port ' + server.address().port);
    else
        console.log(err);
});
