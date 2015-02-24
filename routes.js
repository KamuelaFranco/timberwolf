// Update 'this' for current scope
var parseHttpRequest = require('./lib/parse_http')

var common = require('./lib/common');
var validations = require('./lib/validations');

var bencode = require('bencode');

// For express.Router()
var express = require('express');
var router = express.Router();

// TODO: Populate an actual list of user passkeys from memory or database
var userPasskeys = [432423423,3243243243,2343243243,234423];

// These routes are for torrent access

// TODO: Implement 'secret' param

// Parameter to handle user authentication by checking it against userPasskeys
router.param('secret', function(req, res, next, id) {
    if(userPasskeys.indexOf(id) != -1) { // if the secret is found in userPasskeys
        console.log('Authorized request: ' + id.toString())
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
    res.status(400).send('This is a torrent tracker. Please see the BitTorrent specification page for more information.');
    res.end();
});

// export router for use in app.js
module.exports = router;