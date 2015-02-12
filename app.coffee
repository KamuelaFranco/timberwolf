# Torrent tracker
btt = require 'bittorrent-tracker'
tracker = new btt.Server
  udp:    false
  http:   true
  filter: (infoHash) -> infoHash

tracker.on 'error', (error) ->
  console.log error.message

tracker.on 'warning', (error) ->
  console.log error.message

tracker.on 'listening', ->
  console.log "Listening on http port: #{tracker.http.address().port}"

trackerPort = process.env.TRACKER_PORT or 1337
tracker.listen trackerPort


# Express
express = require 'express'
app = express()

# Statistics API for main site
app.get '/stats', (req, res) ->
  console.log 'GET /stats'
  res.json 'Stats'
  res.end

# Express server start
port = process.env.PORT or 3000
app.listen port, ->
  console.log 'Listening on port ' + port