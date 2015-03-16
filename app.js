console.log('Timberwolf Private Torrent Tracker');
// Requires
var config = require('config');
var express = require('express');
var app = express();

process.stdout.write('Loading admin key from environment...');
TIMBERWOLF_ADMIN_SECRET = process.env.TIMBERWOLF_ADMIN_SECRET || 'horriblePassword';
console.log('Done');

process.stdout.write('Initializing Express routes...');
// Routes specified in routes.js
var routes = require('./routes');
app.use(routes);
console.log('Done');

app.listen(config.get('tracker.port'), function () {
    console.log('Tracker is now listening on port ' + config.get('tracker.port') + '...');
});