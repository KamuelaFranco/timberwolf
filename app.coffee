Server = require './server'
server = new Server
  http: false,
  udp: false

onHttpRequest = server.onHttpRequest.bind server

express = require 'express'
app = express()

router = express.Router()

router.use (req, res, next) ->
  console.log 'Caught a request'
  next()

router.get '/announce/:id', (req, res, next) ->
  console.log req.params.id
  res.send 'Lose!'
  next()

app.use '/', router

app.get '/announce', onHttpRequest
app.get '/scrape', onHttpRequest

app.listen 3000, ->
  console.log 'Tracker listening on a port...'