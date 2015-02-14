var app, btt, express, port, tracker, trackerPort;

port = process.env.PORT || 3000;

trackerPort = process.env.PORT_TRACKER || 3001;

btt = require('./server');

tracker = new btt.Server({
  udp: false,
  http: true,
  filter: function(infoHash) {
    return infoHash;
  }
});

tracker.on('error', function(error) {
  return console.log(error.message);
});

tracker.on('warning', function(error) {
  return console.log(error.message);
});

tracker.listen(trackerPort, function() {
  return console.log("Tracker module listening on http port: " + (tracker.http.address().port));
});

express = require('express');

app = express();

app.get('/stats', function(req, res) {
  console.log('GET /stats');
  res.json('Stats');
  return res.end;
});

app.listen(port, function() {
  return console.log('Express listening on port ' + port);
});