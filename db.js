// TODO: Database implementation
var config = require('config');
var Sequelize = require('sequelize');
var sha1 = require('sha1');

var redisClient = require("redis"),
	redis = redisClient.createClient();

var sequelize = new Sequelize(config.get('database.database'), config.get('database.username'), config.get('database.password'), {
	host: config.get('database.host'),
	dialect: config.get('database.engine'),
	port: config.get('database.port'),

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

sequelize
	.authenticate()
	.complete(function (err) {
		if (err) {
			console.log('Unable to connect to the database:', err)
		}
	});

var User = sequelize.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	passkey: Sequelize.STRING,
	upload: Sequelize.INTEGER,
	download: Sequelize.INTEGER,
	enabled: Sequelize.INTEGER
}, {
	tableName: 'users', // this will define the table's name
	updatedAt: 'updated_at',
	createdAt: 'created_at'
});

var Torrent = sequelize.define('Torrent', {
	seeders: Sequelize.INTEGER,
	leechers: Sequelize.INTEGER,
	snatched: Sequelize.INTEGER,
	size: Sequelize.INTEGER,
	info_hash: Sequelize.BLOB
}, {
	tableName: 'torrents', // this will define the table's name
	updatedAt: 'updated_at',
	createdAt: 'created_at'
});

redis.on("error", function (err) {
	console.log("Redis Error " + err);
});

redis.flushdb(function (err, didSucceed) {
	console.log('Cleared Redis'); // true
});

var exports = module.exports = {};

exports.loadUsers = function () {
	var userCount = 0;
	User.findAll({where: {enabled: 1}}).then(function (users) {
		for (k in users)
		{
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
	Torrent.findAll().then(function (torrents)
	{
		for(k in torrents)
		{
			torrentCount += 1;
			redis.hmset("torrents:" + sha1(torrents[k].info_hash), {
				"seeders": torrents[k].seeders,
				"leechers": torrents[k].leechers,
				"snatched": torrents[k].snatched,
				"size": torrents[k].size,
				"info_hash": torrents[k].info_hash
			});
		}

	}).complete(function () {
		console.log('Loaded torrents: ' + torrentCount);
	});
};

exports.getUser = function (passkey, callback) {
	redis.hgetall("users:" + passkey, function (err, obj) {
		callback(obj);
	});
};

exports.getTorrent = function (info_hash, callback) {
	redis.hgetall("torrents:" + sha1(info_hash), function (err, obj) {
		callback(obj);
	});
};
