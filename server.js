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
passportConfig(passport);

app.use(express.static(path.join(__dirname + '/public')));
app.use(morgan('dev'));

//passport requirements
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

// Web App
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// serve catch-all to web app index
// FIX: breaks serving static assets
// app.get('*', routes.index);

// Authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), function(req, res){
});
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error'}), function(req, res) {
    res.redirect('/');
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// RESTful API
app.get('/api/carer/:thing', routes.api.carerThing);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('DemS Service EXPRESS server listening on port ' + app.get('port') + '...');
});
