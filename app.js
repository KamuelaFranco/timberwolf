// Requires
var Server = require('./server');
// Create new server we manage ourselves, thus false for both options
server = new Server({http: false, udp: false});
var express = require('express');
var config = require('config');
var db = require('./db');
var app = express();


// Validation functions
// TODO: Implement this DB check for users #user_validation
var isGoodUser = function (secret, callback) {
    db.getUser(secret, function (reply) {
        if (reply == null) {
            callback(false);
        }
        else {
            callback(true)
        }
    });
};

// TODO: Implement function for checking info_hash against DB #torrent_existence
var doesTorrentExist = function (infohash) {
    return true;
};

// TODO: Implement function to check torrent client against blocked list #client_whitelisting
var isTorrentClientGood = function (torrentCient) {
    return true;
};

var clearToAnnounce = function (secret, infohash, torrentClient, callback) {
    isGoodUser(secret, function (response) {
        if (response == false) {
            callback(false);
            return false;
        }
    });
};

// TODO: Better understand what's going on here
var onHttpRequest = server.onHttpRequest.bind(server);

app.get('/:secret/announce', function (req, res) {
    // TODO: Check this against the Bitcoin protocol docs for getting the right queries
    clearToAnnounce(req.params.secret, req.query.info_hash, req.query.peer_id, function (response)
    {
        if (response) {
            // TODO: Test this function
            onHttpRequest(req, res, {action: 'announce'});
        } else {
            res.send(200, 'blah');
            res.end();
        }
    });
});

// TODO: Allow for custom port settings and dynamic listening
app.listen(3000, function () {
    return console.log('Tracker listening on a port...');
});

//Get all information
db.loadUsers();
db.loadTorrents();