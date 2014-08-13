/**
 * Module Dependencies
 */
var express = require('express'),
    routesWebapp = require('./routes/webapp.js'), // TODO: import whole folder
    routesApi = require('./routes/api.js'),
    morgan = require('morgan'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path');

var app = express();

/**
 * Configuration
 */
app.use(express.static(path.join(__dirname + 'public')));
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

// ROUTES
// 

// Web App
app.get('/', routesWebapp.index);
app.get('/partials/:name', routesWebapp.partials);

// RESTful API
app.get('/api/carer/:thing', routesApi.carerThing);

// serve catch-all to web app index
app.get('*', routesWebapp.index);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Agorophinstify EXPRESS server listening on port ' + app.get('port') + '...');
});