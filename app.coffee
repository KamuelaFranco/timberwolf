Server = require './server'
server = new Server
  http: false,
  udp: false

// TODO: Figure out why this is needed
onHttpRequest = server.onHttpRequest.bind server

// TODO: Implement checkSecret by referencing list of secret keys
checkSecret = (secret) ->
  true

express = require 'express'
app = express()

// TODO: Test this route
app.get '/:secret/announce', (req, res) ->
  checkSecret req.params.secret, (isValid) ->
    if isValid
      // TODO: Test this call
      server.onHttpRequest req, res, action: 'announce'
    else res.send 200, EMPTY_ANNOUNCE_RESPONSE

// TODO: Dynamically determine port with environment variable
app.listen 3000, ->
  console.log 'Tracker listening on a port...'