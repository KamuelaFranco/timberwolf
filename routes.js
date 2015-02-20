var Server = require('./lib/server');
// Create new server we manage ourselves, thus false for both options
var server = new Server({http: false, udp: false});
// Update 'this' for current scope
var onHttpRequest = server.onHttpRequest.bind(server);

var common = require('./lib/common');
var validations = require('./lib/validations');

var bencode = require('bencode');
var db = require('./lib/db');

// For express.Router()
var express = require('express');
var router = express.Router();

// Routes

// TODO: Fix all of these routes to properly "bubble down"
router.get('/:secret/*', function (req, res, next) {
    var secret = params.query.secret;
    validations.isGoodUser(secret, function (result) {
        if (result != true) {
            callback('Invalid passkey');
            return false;
        }
    });
});

// Save parameters to Redis and return swarm
router.get('/:secret/announce', function (req, res) {
    validations.doesTorrentExist(infohash, function (result) {
        if (result != true) {
            callback('Unregistered torrent');
            return false;
        }
        callback(true);
    });

    // TODO: Return swarm

    // TODO: Save queries to Redis
    res.end();
});

// TODO: Implement scrape functionality
// Return peer count in swarm
router.get('/:secret/scrape', function (req, res) {
    res.end('Scrape has not been implemented yet. Please /announce instead.');
});

// Parse Redis to write to persistent database
router.get('/:secret/flush', function (req, res) {

});


// Catch-all for malformed request. Must remain as the last route or will break the tracker.
// TODO: Make sure this doesn't belong _before_ other routes rather than after.
router.all('*', function(req, res) {
    res.status(400).send('This is a torrent tracker. Please see the Bitcoin specification page for more information.');
});

// export router for use in app.js
module.exports = router;