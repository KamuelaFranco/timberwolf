# timberwolf
## A private torrent tracker based on [bittorrent-tracker](https://github.com/feross/bittorrent-tracker) written in [Node.js](http://github.com/joyent/node)

This project is optimized for use as a private tracker. All requests flow through a user authentication function first, and then must subsequently pass torrent client whitelisting checks followed by the existence of the torrent itself on the tracker. Stats are cached locally with Redis and then written to a persistent database at a set time out.