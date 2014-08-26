/**
 * Module Dependencies
 */
var express = require('express'),
    routes = require('./routes'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session');

var app = express();

/**
 * Configuration
 */
var passportConfig = require('./controllers/passport.js');
passportConfig.init(passport);

app.use(express.static(path.join(__dirname + '/public')));
app.use(morgan('dev'));

// passport requirements
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(session({ secret: 'cat-im-a-kitty-cat', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.set('port', process.env.PORT || 3000);

var env = process.env.NODE_ENV || 'development';

// development environment only
if (env === 'development') {
  app.use(errorHandler());
}

// production environment only
if (env === 'production') {
  // TODO
}

/*
 * Routes
 */
routes.init(app, passport);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('DemS Service EXPRESS server listening on port ' + app.get('port') + '...');
});
