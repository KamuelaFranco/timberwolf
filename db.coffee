module.exports

pg = require 'pg'
conString = 'postgres://testing:testing@localhost/database'

#Constructor
Database = (config) -> false

loadConfig = (config) -> false

reloadConfig = (config) -> false

connected = -> false

clearPeerData = -> false

loadTorrents = (torrents) -> false

loadUsers = (users) -> false

loadTokens = (torrents) -> false

loadWhitelist = (whitelist) -> false

recordToken = (record) -> false

recordUser = (record) -> false

recordTorrent = (record) -> false

#void mysql::record_peer(const std::string &record, const std::string &ip, const std::string &peer_id, const std::string &useragent)
#void mysql::record_peer(const std::string &record, const std::string &peer_id)
#//TODO: make this shit work
recordPeer = () -> false

recordSnatch = (record, ip) -> false

allClear = -> false

flush = -> false

flushUsers = -> false

flushTorrents = -> false

flushSnatches = -> false

flushPeers = -> false

flushTokens = -> false

doFlushUsers = -> false

doFlushTorrents = -> false

doFlushPeers = -> false

doFlushSnatches = -> false

doFlushTokens = -> false