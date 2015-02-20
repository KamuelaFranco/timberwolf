// Requires
var config = require('config');
var db = require('./lib/db');
var express = require('express');
var app = express();

// Routes specified in routes.js
var routes = require('./routes');
app.use(routes);

// Get all information
//db.loadUsers();
//db.loadTorrents();
//db.loadWhitelist();

app.listen(config.get('tracker.port'), function () {
    return console.log('Tracker listening on a port ' + config.get('tracker.port'));
});