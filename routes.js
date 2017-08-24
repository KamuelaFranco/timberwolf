const parseHttp = require('./lib/parse_http');
const express = require('express');

// Initialize user statistics
let stats = require('./lib/stats');

const router = express.Router();

// TODO: Populate an actual list of user passkeys from memory or database
let userPasskeys = ['432423423', '3243243243', '2343243243', '234423'];
let torrents = ['cb26218e255fd66c9af955cf755457d0a5f72891'];

// TODO: Implement whitelist support
let whitelist = ['asdf', 'asdf2'];

const TIMBERWOLF_ADMIN_SECRET = process.env.TIMBERWOLF_ADMIN_SECRET || 'horriblePassword';

// These routes are for torrent access

// Parameter to handle user authentication by checking it against userPasskeys
router.param('secret', (req, res, next, id) => { // id is type string
  console.log(userPasskeys.indexOf(id));
  if (userPasskeys.indexOf(id) !== -1) { // if the secret is found in userPasskeys
    console.log(`Authorized request: ${id}`);
    next();
  } else {
    res.end('Invalid passkey');
  }
});

// Save parameters and return swarm
router.get('/:secret/announce', (req, res) => {
  // TODO: Fix req.query.info_hash check
  // TODO: Check torrent existence
  const infoHash = req.query.info_hash;
  // check for info_hash and check for it in cache
  if (infoHash && torrents.indexOf(infoHash) !== -1) {
    // TODO: Return swarm
    parseHttp.parseAnnounceRequest(req);
    // TODO: Save params to cache
    stats.save(req, stats);
  } else {
    res.end('No such torrent on tracker');
  }
});

// TODO: Implement scrape functionality
// Return peer count in swarm
router.get('/:secret/scrape', (req, res) => {
  parseHttp.parseScrapeRequest(req);
  res.end('Scrape has not been implemented yet. Please /announce instead.');
});

// TODO: Implement stats return
// These routes are for API access
router.get('/stats', (req, res) => {
  if (req.query.adminKey !== TIMBERWOLF_ADMIN_SECRET) {
    res.end('Failed authorization: Bad admin key');
  }
  res.json(stats);
  stats = [];
  res.end('Stats cleared successfully');
});

// These routes are for admin access
router.post('/data', (req, res) => {
  if (req.query.adminKey !== TIMBERWOLF_ADMIN_SECRET) {
    res.end('Failed authorization: Bad admin key');
  }

  const newPasskeys = req.query.userPasskeys;
  const newWhiteList = req.query.whitelist;
  const newTorrents = req.query.torrents;

  try {
    torrents = newTorrents;
    whitelist = newWhiteList;
    userPasskeys = newPasskeys;
  } catch (error) {
    res.end('New data could not be saved');
  }
  res.end('Tracker updated');
});

// Catch-all for malformed request. Must remain as the last route or will break the tracker.
router.all('*', (req, res) => {
  res.status(400).send('This is a torrent tracker. Please see the BitTorrent specification page for more information.');
  res.end();
});

// export router for use in app.js
module.exports = router;
