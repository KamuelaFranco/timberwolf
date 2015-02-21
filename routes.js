// Update 'this' for current scope
var parseHttpRequest = require('./lib/parse_http')

var common = require('./lib/common');
var validations = require('./lib/validations');

var bencode = require('bencode');
var db = require('./lib/db');

// For express.Router()
var express = require('express');
var router = express.Router();

var userPasskeys = [432423423,3243243243,2343243243,234423];

// These routes are for torrent access


router.get('/:secret/*', function (req, res, next) {
    var secret = params.query.secret;
    // Check presence of secret in userPasskeys
    if(userPasskeys.indexOf(secret) != -1) {
        next();
    } else {
        res.end('bad request');
    }
});

// Save parameters and return swarm
router.get('/:secret/announce', function (req, res) {
    // TODO: Check torrent existence

    // TODO: Return swarm

    // TODO: Save queries to Redis
    res.end();
});

// TODO: Implement scrape functionality
// Return peer count in swarm
router.get('/:secret/scrape', function (req, res) {
    res.end('Scrape has not been implemented yet. Please /announce instead.');
});

// TODO: Implement stats return
// These routes are for API access
router.get('/stats', function (req, res) {
    res.json(userPasskeys);
    res.end();
});

// Catch-all for malformed request. Must remain as the last route or will break the tracker.
router.all('*', function(req, res) {
    res.status(400).send('This is a torrent tracker. Please see the Bitcoin specification page for more information.');
    res.end();
});

// export router for use in app.js
module.exports = router;