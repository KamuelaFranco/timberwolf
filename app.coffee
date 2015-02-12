port = process.env.PORT || 3000
trackerPort = process.env.PORT_TRACKER || 3001

# Torrent tracker
btt = require 'bittorrent-tracker'
tracker = new btt.Server
  udp:    false
  http:   true
  filter: (infoHash) -> infoHash

# Show errors in console
tracker.on 'error', (error) ->
  console.log error.message
tracker.on 'warning', (error) ->
  console.log error.message

# Tracker server start
tracker.listen trackerPort, ->
  console.log "Tracker module listening on http port: #{tracker.http.address().port}"

# Express
express = require 'express'
app = express()

# Statistics API for main site
app.get '/stats', (req, res) ->
  console.log 'GET /stats'
  res.json 'Stats'
  res.end

# Express server start
app.listen port, ->
  console.log 'Express listening on port ' + port