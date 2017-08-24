console.log('Timberwolf Private Torrent Tracker');
// Requires
const config = require('config');
const express = require('express');

const app = express();

process.stdout.write('Loading admin key from environment...');
const TIMBERWOLF_ADMIN_SECRET = process.env.TIMBERWOLF_ADMIN_SECRET || 'horriblePassword';
console.log('Done');

process.stdout.write('Initializing Express routes...');
// Routes specified in routes.js
const routes = require('./routes');

app.use(routes);
console.log('Done');

app.listen(config.get('tracker.port'), () => {
  console.log(`Tracker is now listening on port ${config.get('tracker.port')}...`);
});
