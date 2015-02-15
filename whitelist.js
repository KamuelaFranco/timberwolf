// TODO: Implement the whitelist functionality

var peerId = '320303';

// TODO: Properly implement an error protocol for bad peer ID
if peerId.length() != 20 {
  throw new Error('peer_id is malformed');
}

var whitelistedClients = [
  '','','','',''
];

torrentClientIsGood(peerId) {
  // TODO: If peerId not in whitelist, return false
  return true;
}