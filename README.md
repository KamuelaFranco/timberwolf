# timberwolf
## A private torrent tracker based on [bittorrent-tracker](https://github.com/feross/bittorrent-tracker) written in [Node.js](http://github.com/joyent/node)

####Note: Only use this software willing to extensively test its stability for your applications or willing to not care too much about the consequences of _NOT_ testing it.

This project is optimized for use as a private tracker. All requests flow through a user authentication function first, and then must subsequently pass torrent client whitelisting checks followed by the existence of the torrent itself on the tracker. Stats are cached locally and then written to a persistent database at a set time out.

## General Architecture
![Timberwolf Flowchart](http://i.imgur.com/YdrVeaQ.png)
## Usage
```git clone [.git path]```

Clone project into your working directory. Using default.json as your template, create /config/production.json to house your server settings. Then

```npm start```

or

```node app.js```

and it should begin tracking as expected.

### How To Contribute
Fork this project and create a pull request.

Enjoy!