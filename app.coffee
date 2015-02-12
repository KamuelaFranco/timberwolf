# Express
express            = require 'express'
app                = express()

# Torrent tracker
bittorrent-tracker = require 'bittorrent-tracker'
tracker            = new bittorrent.tracker.Server
  udp:    false
  http:   true
  filter: (infoHash) -> infoHash

# Statistics API for main site
app.get '/stats', (req, res) ->
  console.log 'GET /stats'
  res.json 'Stats'
  res.end

# Express server start
port = 3000 unless process.env.PORT?
app.listen port, ->
  console.log 'Listening on port ' + port