Server = require './server'
server = new Server
  http: false,
  udp: false

onHttpRequest = server.onHttpRequest.bind server

checkSecret = (secret) ->
  true

express = require 'express'
app = express()

app.get '/:secret/announce', (req, res) ->
  checkSecret req.params.secret, (isValid) ->
    if isValid
      server.onHttpRequest req, res, options: 'announce'
    else res.send 200, EMPTY_ANNOUNCE_RESPONSE

app.listen 3000, ->
  console.log 'Tracker listening on a port...'