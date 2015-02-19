// Requires
var config = require('config');
var db = require('./lib/db');
var express = require('express');
var app = express();

var schedule = require('node-schedule');

// Routes specified in routes.js
// TODO: Fix router middleware compile error
var routes = require('./routes');
routes.use('routes');

// Get all information
db.loadUsers();
db.loadTorrents();

// TODO: Load the whitelist from config

// Flush Redis to persistent storage on time out
var f = schedule.scheduleJob('*/1 * * * *', function () {
	db.flushTorrents();
	db.flushUsers();
});

app.listen(config.get('tracker.port'), function () {
    return console.log('Tracker listening on a port' + config.get('tracker.port'));
});