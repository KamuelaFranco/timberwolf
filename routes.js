var parseHttp = require('./lib/parse_http');

var common = require('./lib/common');
var validations = require('./lib/validations');

var bencode = require('bencode');

// For express.Router()
var express = require('express');
var router = express.Router();

// TODO: Populate an actual list of user passkeys from memory or database
var userPasskeys = ['432423423','3243243243','2343243243','234423'];
var torrents = ['cb26218e255fd66c9af955cf755457d0a5f72891'];

// These routes are for torrent access

// Parameter to handle user authentication by checking it against userPasskeys
router.param('secret', function(req, res, next, id) { // id is type string
    console.log(userPasskeys.indexOf(id));
    if (userPasskeys.indexOf(id) !== -1) { // if the secret is found in userPasskeys
        console.log('Authorized request: ' + id);
        next();
    } else {
        res.end('Invalid passkey');
    }
});

// Save parameters and return swarm
router.get('/:secret/announce', function (req, res) {
    // TODO: Fix req.query.info_hash check
    // TODO: Check torrent existence
    var infoHash = req.query.info_hash;
    if (infoHash && torrents.indexOf(infoHash) !== -1) { // check for info_hash and check for it in cache
        // TODO: Return swarm
        parseHttp.parseAnnounceRequest(req);
        // TODO: Save params to cache
    } else {
        res.end('No such torrent on tracker');
    }
});

// TODO: Implement scrape functionality
// Return peer count in swarm
router.get('/:secret/scrape', function (req, res) {
    parseHttp.parseScrapeRequest(req);
    res.end('Scrape has not been implemented yet. Please /announce instead.');
});

// TODO: Implement stats return
// These routes are for API access
router.get('/stats', function (req, res) {
    var authCode = req.query.auth;
    if (authCode === config.get('stats.auth')) {
        res.end('Here are the stats');
    } else {
        res.end('Failed authorization');
    }
});

// Catch-all for malformed request. Must remain as the last route or will break the tracker.
router.all('*', function(req, res) {
    res.status(400).send('This is a torrent tracker. Please see the BitTorrent specification page for more information.');
    res.end();
});

// export router for use in app.js
module.exports = router;