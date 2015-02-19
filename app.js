// Requires
var Server = require('./lib/server');
// Create new server we manage ourselves, thus false for both options
server = new Server({http: false, udp: false});
var express = require('express');
var config = require('config');
var db = require('./lib/db');
var bencode = require('bencode');
var app = express();
var common = require('./lib/common');
var schedule = require('node-schedule');
var validations = require('./lib/validations');

// TODO: Better understand what's going on here
var onHttpRequest = server.onHttpRequest.bind(server);

app.get('/:secret/announce', function (req, res) {
	var info_hash = common.binaryToHex(unescape(req.query.info_hash));
	clearToAnnounce(req.params.secret, info_hash, req.query.peer_id, function (response) {
		if (response == true) {
			onHttpRequest(req, res, {action: 'announce'});
		} else {
			res.end(bencode.encode({
				'failure reason': response
			}));
		}
	});
});

app.get('/:secret/scrape', function (req, res) {
	var info_hash = common.binaryToHex(unescape(req.query.info_hash));
	clearToAnnounce(req.params.secret, info_hash, req.query.peer_id, function (response) {
		if (response == true) {
			onHttpRequest(req, res, {action: 'scrape'});
		} else {
			res.end(bencode.encode({
				'failure reason': response
			}));
		}
	});
});

app.get('/flush', function (req, res) {
	db.flushTorrents();
	res.end();
});

// TODO: Allow for custom port settings and dynamic listening
app.listen(3000, function () {
	return console.log('Tracker listening on a port...');
});

//Get all information
db.loadUsers();
db.loadTorrents();

var f = schedule.scheduleJob('*/1 * * * *', function () {
	db.flushTorrents();
	db.flushUsers();
});
