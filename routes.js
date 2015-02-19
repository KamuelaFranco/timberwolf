var Server = require('./lib/server');
// Create new server we manage ourselves, thus false for both options
var server = new Server({http: false, udp: false});
// Update 'this' for current scope
var onHttpRequest = server.onHttpRequest.bind(server);

var common = require('./lib/common');
var validations = require('./lib/validations');

var bencode = require('bencode');
var db = require('./lib/db');

var express = require('express');
var router = express.Router();

// Routes

// TODO: Fix all of these routes to properly "bubble down"
app.get('/:secret/*', function (req, res, next) {
    var secret = params.query.secret;
    validations.isGoodUser(secret, function (result) {
        if (result != true) {
            callback('Invalid passkey');
            return false;
        }
    });
});

// Save parameters to Redis and return swarm
app.get('/:secret/announce', function (req, res) {
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
app.get('/:secret/scrape', function (req, res) {
    res.end('Scrape has not been implemented yet. Please /announce instead.');
});

// Parse Redis to write to persistent database
app.get('/:secret/flush', function (req, res) {
    db.flushTorrents();
    res.end('Flushed');
});


// Catch-all for malformed request. Must remain as the last route or will break the tracker.
// TODO: Make sure this doesn't belong _before_ other routes rather than after.
app.all('*', function() {
    res.status(400).send('This is a torrent tracker. Please see the Bitcoin specification page for more information.');
});

module.exports = router;

/* Old Routes
app.get('/:secret/announce', function (req, res) {
    var info_hash = common.binaryToHex(unescape(req.query.info_hash));
    clearToAnnounce(req.params.secret, info_hash, req.query.peer_id, function (response) {
        if (response == true) {
            onHttpRequest(req, res, {action: 'announce'});
        } else {
            res.end(bencode.encode({
                'failure reason': response
            }));
        }
    });
});

app.get('/:secret/scrape', function (req, res) {
    var info_hash = common.binaryToHex(unescape(req.query.info_hash));
    clearToAnnounce(req.params.secret, info_hash, req.query.peer_id, function (response) {
        if (response == true) {
            onHttpRequest(req, res, {action: 'scrape'});
        } else {
            res.end(bencode.encode({
                'failure reason': response
            }));
        }
    });
});

app.get('/flush', function (req, res) {
    db.flushTorrents();
    res.end();
});*/
