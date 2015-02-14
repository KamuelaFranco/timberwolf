var Server, app, checkSecret, express, onHttpRequest, server;

Server = require('./server');

server = new Server({
  http: false,
  udp: false
});

onHttpRequest = server.onHttpRequest.bind(server);

checkSecret = function(secret) {
  return true;
};

express = require('express');

app = express();

app.get('/:secret/announce', function(req, res) {
  return checkSecret(req.params.secret, function(isValid) {
    if (isValid) {
      return server.onHttpRequest(req, res, {
        action: 'announce'
      });
    } else {
      return res.send(200, EMPTY_ANNOUNCE_RESPONSE);
    }
  });
});

app.listen(3000, function() {
  return console.log('Tracker listening on a port...');
});