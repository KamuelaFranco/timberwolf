var config = require('config');
var common = require('./common');

var exports = module.exports = {};

exports.loadUsers = function () {
	var userCount = 0;
	User.findAll({where: {enabled: 1}}).then(function (users) {
		for (k in users) {
			userCount += 1;

			redis.hmset("users:" + users[k].passkey, {
				"username": users[k].username,
				"id": users[k].id,
				"download": users[k].download,
				"passkey": users[k].passkey,
				"upload": users[k].upload,
				"enabled": users[k].enabled
			});
		}
	}).complete(function () {
		console.log('Loaded users: ' + userCount);
	});
};

exports.loadTorrents = function () {
	var torrentCount = 0;
	Torrent.update({seeders: 0, leechers: 0}, {where: {}}).complete(function(){
		Torrent.findAll().then(function (torrents) {
			for (k in torrents) {
				torrentCount += 1;
				exports.updateTorrent({
					"seeders": torrents[k].seeders,
					"leechers": torrents[k].leechers,
					"snatched": torrents[k].snatched,
					"id": torrents[k].id,
					"info_hash": common.binaryToHex(torrents[k].info_hash)
				})
			}

		}).complete(function () {
			console.log('Loaded torrents: ' + torrentCount);
		});
	});
};

exports.getUser = function (passkey, callback) {
	redis.hgetall("users:" + passkey, function (err, obj) {
		callback(obj);
	});
};

exports.getTorrent = function (info_hash, callback) {
	redis.hgetall("torrents:" + info_hash, function (err, obj) {
		callback(obj);
	});
};

exports.flushTorrents = function () {
	redis.keys("torrents:*", function (err, torrents) {
		console.log("Flushing " + torrents.length + " torrents.");
		torrents.forEach(function (torrent, i) {
			info_hash = torrent.split(":")[1];
			exports.getTorrent(info_hash, function (torrent) {
				Torrent.update(
					{
						'seeders': torrent.seeders,
						'leechers': torrent.leechers,
						'snatched': torrent.snatched
					},
					{
						where: {id: torrent.id}
					}
				).then(function () {
						// TODO: send API call to site to update the cache
					});
			});
		});
	});
};

exports.flushUsers = function () {
	redis.keys('users:*', function (err, users) {
		users.forEach(function (user, i) {
			passkey = user.split(":")[1];
			exports.getUser(passkey, function (user) {
				User.update(
					{
						upload: user.upload,
						download: user.download
					},
					{
						where: {id: user.id}
					}
				).then(function () {
						// TODO: send API call to site to update the cache
					});
			});
		});
	});
};

exports.updateTorrent = function (data) {
	redis.hmset("torrents:" + data.info_hash, {
		"seeders": data.seeders,
		"leechers": data.leechers,
		"snatched": data.snatched,
		"id": data.id,
		"info_hash": data.info_hash
	});

};

exports.loadWhitelist = function() {
    redis.hmset("whitelist:",);
};