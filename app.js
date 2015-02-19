// Requires
var config = require('config');
var db = require('./lib/db');

var schedule = require('node-schedule');

// Routes specified in routes.js
var routes = require('./routes');
app.use('routes');

// Get all information
db.loadUsers();
db.loadTorrents();

// Flush Redis to persistent storage on time out
var f = schedule.scheduleJob('*/1 * * * *', function () {
	db.flushTorrents();
	db.flushUsers();
});

// TODO: Allow for custom port settings and dynamic listening through config
app.listen(3000, function () {
    return console.log('Tracker listening on a port...');
});