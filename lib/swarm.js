module.exports = Swarm;

var debug = require('debug')('bittorrent-tracker');
var db = require('./db');
var common = require('./common');

// Regard this as the default implementation of an interface that you
// need to support when overriding Server.getSwarm()
function Swarm(infoHash, server) {
	this.peers = {};
	this.complete = 0;
	this.incomplete = 0
}

Swarm.prototype.announce = function (params, cb) {
	var self = this;
	var peer = self.peers[params.addr];

	// Dispatch announce event
	var fn = '_onAnnounce_' + params.event;
	if (self[fn]) {
		self[fn](params, peer); // process event

		if (params.left === 0 && peer) peer.complete = true;

		cb(null, {
			complete: self.complete,
			incomplete: self.incomplete,
			peers: self._getPeers(params.numwant)
		})
	} else {
		cb(new Error('invalid event'))
	}
};

Swarm.prototype._onAnnounce_started = function (params, peer) {
	if (peer) {
		debug('unexpected `started` event from peer that is already in swarm');
		return this._onAnnounce_update(params, peer); // treat as an update
	}

	db.getTorrent(params.info_hash, function(tor){
		if (params.left === 0) {
			tor.seeders = parseInt(tor.seeders) + 1;
		}
		else {
			tor.leechers = parseInt(tor.leechers) + 1;
		}
		db.updateTorrent(tor);
	});

	if (params.left === 0) {
		this.complete += 1;

	}
	else {
		this.incomplete += 1;
	}
	peer = this.peers[params.addr] = {
		ip: params.ip,
		port: params.port,
		peerId: params.peer_id,
		complete: false
	}
};

Swarm.prototype._onAnnounce_stopped = function (params, peer) {
	if (!peer) {
		debug('unexpected `stopped` event from peer that is not in swarm');
		return; // do nothing
	}

	db.getTorrent(params.info_hash, function(tor){
		if (params.complete) {
			tor.seeders = parseInt(tor.seeders) - 1;
		}
		else {
			tor.leechers = parseInt(tor.leechers) - 1;
		}
		db.updateTorrent(tor);
	});


	if (peer.complete) {
		this.complete -= 1;
	}
	else {
		this.incomplete -= 1;
	}


	this.peers[params.addr] = null
};

Swarm.prototype._onAnnounce_completed = function (params, peer) {
	if (!peer) {
		debug('unexpected `completed` event from peer that is not in swarm');
		return this._onAnnounce_started(params, peer); // treat as a start
	}
	if (peer.complete) {
		debug('unexpected `completed` event from peer that is already marked as completed');
		return; // do nothing
	}

	db.getTorrent(params.info_hash, function(tor){
		tor.seeders = parseInt(tor.seeders) + 1;
		tor.leechers = parseInt(tor.leechers) - 1;
		tor.snatched = parseInt(tor.snatched) + 1;
		db.updateTorrent(tor);
	});

	this.complete += 1;
	this.incomplete -= 1;
	peer.complete = true
};

Swarm.prototype._onAnnounce_update = function (params, peer) {
	if (!peer) {
		debug('unexpected `update` event from peer that is not in swarm');
		return this._onAnnounce_started(params, peer); // treat as a start
	}
};

Swarm.prototype._getPeers = function (numwant) {
	var peers = [];
	for (var peerId in this.peers) {
		if (peers.length >= numwant) break;
		var peer = this.peers[peerId];
		if (!peer) continue; // ignore null values
		peers.push({
			'peer id': peer.peerId,
			ip: peer.ip,
			port: peer.port
		})
	}
	return peers
};

Swarm.prototype.scrape = function (params, cb) {
	cb(null, {
		complete: this.complete,
		incomplete: this.incomplete
	})
};
