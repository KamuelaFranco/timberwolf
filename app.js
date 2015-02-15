// Requires
var Server = require('./server');
// Create new server we manage ourselves, thus false for both options
server = new Server({http: false, udp: false});
var express = require('express');
var config = require('config');
var db = require('./db');
var bencode = require('bencode');
var app = express();
var common = require('./lib/common');
var schedule = require('node-schedule');


// Validation functions
// TODO: Implement this DB check for users #user_validation
var isGoodUser = function (secret, callback) {
    db.getUser(secret, function (reply) {
        if (reply == null) {
            callback('passkey not found');
        }
        else {
            callback(true)
        }
    });
};

// TODO: Implement function for checking info_hash against DB #torrent_existence
var doesTorrentExist = function (infohash, callback) {
	db.getTorrent(infohash, function (reply) {
		if (reply == null) {
			callback('Unregistered Torrent');
		}
		else {
			callback(true)
		}
	});
};

// TODO: Implement function to check torrent client against blocked list #client_whitelisting
var isTorrentClientGood = function (torrentCient) {
    return true;
};

var clearToAnnounce = function (secret, infohash, torrentClient, callback) {
    isGoodUser(secret, function (response) {
        if (response != true) {
            callback(response);
            return false;
        }
    });

	doesTorrentExist(infohash, function (response) {
		if (response != true) {
			callback(response);
		}
	});
};

// TODO: Better understand what's going on here
var onHttpRequest = server.onHttpRequest.bind(server);

app.get('/:secret/announce', function (req, res) {
    // TODO: Check this against the Bitcoin protocol docs for getting the right queries
	var info_hash = common.binaryToHex(unescape(req.query.info_hash));
    clearToAnnounce(req.params.secret, info_hash, req.query.peer_id, function (response)
    {
        if (response == true) {
            // TODO: Test this function
            onHttpRequest(req, res, {action: 'announce'});
        } else {
	        res.status(200);
	        res.send('failure reason:'+bencode.encode(response));
			res.end();
        }
    });
});

app.get('/flush', function(req, res){
	db.flushUsers();
	res.end();
});

// TODO: Allow for custom port settings and dynamic listening
app.listen(3000, function () {
    return console.log('Tracker listening on a port...');
});

//Get all information
db.loadUsers();
db.loadTorrents();

var f = schedule.scheduleJob('*/5 * * * *', function()
{
	db.flushTorrents();
	db.flushUsers();
});