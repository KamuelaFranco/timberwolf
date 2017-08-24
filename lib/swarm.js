const debug = require('debug')('bittorrent-tracker');

// Regard this as the default implementation of an interface that you
// need to support when overriding Server.getSwarm()
class Swarm {
  constructor() {
    this.peers = {};
    this.complete = 0;
    this.incomplete = 0;
  }

  announce(params, cb) {
    const peer = this.peers[params.addr];

    // Dispatch announce event
    const fn = `_onAnnounce_${params.event}`;
    if (this[fn]) {
      this[fn](params, peer); // process event

      if (params.left === 0 && peer) peer.complete = true;

      cb(null, {
        complete: this.complete,
        incomplete: this.incomplete,
        peers: this._getPeers(params.numwant),
      });
    } else {
      cb(new Error('invalid event'));
    }
  }

  scrape(params, cb) {
    cb(null, {
      complete: this.complete,
      incomplete: this.incomplete,
    });
  }

  _onAnnounceStarted(params, peer) {
    if (peer) {
      debug('unexpected `started` event from peer that is already in swarm');
      return this._onAnnounceUpdate(params, peer); // treat as an update
    }

    if (params.left === 0) this.complete += 1;
    else this.incomplete += 1;
    this.peers[params.addr] = {
      ip: params.ip,
      port: params.port,
      peerId: params.peer_id,
      complete: false,
    };
  }

  _onAnnounceStopped(params, peer) {
    if (!peer) {
      debug('unexpected `stopped` event from peer that is not in swarm');
      return; // do nothing
    }

    if (peer.complete) this.complete -= 1;
    else this.incomplete -= 1;
    this.peers[params.addr] = null;
  }

  _onAnnounceCompleted(params, peer) {
    if (!peer) {
      debug('unexpected `completed` event from peer that is not in swarm');
      return this._onAnnounceStarted(params, peer); // treat as a start
    }
    if (peer.complete) {
      debug('unexpected `completed` event from peer that is already marked as completed');
      // do nothing
    }
  }

  _onAnnounceUpdate(params, peer) {
    if (!peer) {
      debug('unexpected `update` event from peer that is not in swarm');
      return this._onAnnounceStarted(params, peer); // treat as a start
    }
  }

  _getPeers(numwant) {
    const peers = [];
    for (const peerId in this.peers) {
      if (peers.length >= numwant) break;
      const peer = this.peers[peerId];
      if (!peer) continue; // ignore null values
      peers.push({
        'peer id': peer.peerId,
        ip: peer.ip,
        port: peer.port,
      });
    }
    return peers;
  }
}

module.exports = Swarm;
