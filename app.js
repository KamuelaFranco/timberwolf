// Validation functions
// TODO: Implement this DB check for users #user_validation
var isGoodUser = function(secret) {
  return true;
  // TODO: Return false if user has bad ratio
};

// TODO: Implement function for checking info_hash against DB #torrent_existence
var doesTorrentExist = function(infohash) {
  return true;
};

// TODO: Implement function to check torrent client against blocked list #client_whitelisting
var isTorrentClientGood = function(torrentCient) {
  return true;
};

var clearToAnnounce = function(secret, infohash, torrentClient) {
  if (!isTorrentClientGood(torrentClient) ||
    !doesTorrentExist(infohash) ||
    !isGoodUser(secret)) {
    return false;
  } else {
    return true;
  }
};

// Requires
var Server = require('./server');
// Create new server we manage ourselves, thus false for both options
server = new Server({http: false, udp: false});
var express = require('express');
var app = express();

// TODO: Better understand what's going on here
var onHttpRequest = server.onHttpRequest.bind(server);

app.get('/:secret/announce', function(req, res) {
  // TODO: Check this against the Bitcoin protocol docs for getting the right queries
  if (clearToAnnounce(req.params.secret, params.query.infohash, params.query.torrentClient)) {
    // TODO: Test this function
    onHttpRequest(req, res, { action: 'announce' });
  } else {
    res.send(200, EMPTY_ANNOUNCE_RESPONSE);
    res.end();
  }
});

// TODO: Allow for custom port settings and dynamic listening
app.listen(3000, function() {
  return console.log('Tracker listening on a port...');
});