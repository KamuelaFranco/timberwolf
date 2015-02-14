var Server = require('./server');

// Create new server we manage ourselves, thus false for both options
server = new Server({http: false, udp: false});

// TODO: Better understand what's going on here
var onHttpRequest = server.onHttpRequest.bind(server);

// TODO: Implement this DB check
var checkSecret = function(secret) {
  return true;
};

var express = require('express');
var app = express();

app.get('/:secret/announce', function(req, res) {
  return checkSecret(req.params.secret, function(isValid) {
    if (isValid) {
      // TODO: Test this function
      return server.onHttpRequest(req, res, {
        action: 'announce'
      });
    } else {
      return res.send(200, EMPTY_ANNOUNCE_RESPONSE);
    }
  });
});

// TODO:
app.listen(3000, function() {
  return console.log('Tracker listening on a port...');
});