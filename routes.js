// TODO: Move all routing to this module
// Routes

// TODO: Fix all of these routes to properly "bubble down"
app.get('/:secret/*', function (req, res, next) {
    next();
});

// Save parameters to Redis and return swarm
app.get('/:secret/announce', function (req, res, next) {
    res.end();
});

// Return peer count in swarm
app.get('/:secret/scrape', function (req, res, next) {
    res.end();
});

// Parse Redis to write to persistent database
app.get('/:secret/flush', function (req, res, next) {
    res.end('Flushed');
});


// Catch-all for malformed request. Must remain as the last route or will break the tracker.
// TODO: Make sure this doesn't belong _before_ other routes rather than after.
app.all('*', function() {
    res.status(400).send('This is a torrent tracker. Please see the Bitcoin specification page for more information.');
});