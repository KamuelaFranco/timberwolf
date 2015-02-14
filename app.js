// Validation functions

// TODO: Implement this DB check for users
var isGoodUser = function(secret) {
  return true;
  // TODO: Return false if user has bad ratio
};

// TODO: Implement function for checking info_hash against DB
var doesTorrentExist = function(infohash) {
  return true;
};

// TODO: Implement function to check torrent client against blocked list
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
  //var myQueries = {};
  //for(var query in req.query) {
  //
  //}
  // TODO: Check this against the Bitcoin protocol docs for getting the right queries
  if (clearToAnnounce(req.params.secret, params.query.infohash, params.query.torrentClient)) {
      // TODO: Test this function
      server.onHttpRequest(req, res, {
        action: 'announce'
      });
    } else {
      return res.send(200, EMPTY_ANNOUNCE_RESPONSE);
    }
  });
});

// TODO: Allow for custom port settings and dynamic listening
app.listen(3000, function() {
  return console.log('Tracker listening on a port...');
});