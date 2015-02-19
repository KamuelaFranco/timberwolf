// Validation functions
// TODO: Implement this DB check for users #user_validation
exports.isGoodUser = function (secret, callback) {
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
exports.doesTorrentExist = function (infohash, callback) {
    db.getTorrent(infohash, function (reply) {
        if (reply == null) {
            callback('Unregistered Torrent');
        }
        else {
            callback(true);
        }
    });
};

// TODO: Implement function to check torrent client against blocked list #client_whitelisting
exports.isTorrentClientGood = function (torrentCient) {
    return true;
};

exports.clearToAnnounce = function (secret, infohash, torrentClient, callback) {
    isGoodUser(secret, function (res) {
        if (res != true) {
            callback('Invalid passkey');
            return false;
        }
        doesTorrentExist(infohash, function (res) {
            if (res != true) {
                callback('Unregistered torrent');
                return false;
            }
            callback(true);
        });
    });

};