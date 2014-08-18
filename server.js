/**
 * Module Dependencies
 */
var express = require('express'),
    routes = require('./routes'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path');

var app = express();

/**
 * Configuration
 */
app.use(express.static(path.join(__dirname + '/public')));
app.use(morgan('dev'));
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

/**
 * Routes
 */

// Web App
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// serve catch-all to web app index
// FIX: breaks serving static assets
// app.get('*', routes.index);

// RESTful API
app.get('/api/carer/:thing', routes.api.carerThing);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Agorophinstify EXPRESS server listening on port ' + app.get('port') + '...');
});