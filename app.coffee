express   = require 'express'
path      = require 'path'

app       = express()

app.use express.static path.join __dirname, 'public'

app.get '/', (req, res) ->
  console.log 'GET /'
  res.end 'Gotcha'

app.get '/announce/:key', (req, res) ->
  console.log 'GET /announce'
  res.end 'Gotcha announce'

app.get '/scrape', (req, res) ->
  console.log 'GET /scrape'
  res.end 'Gotcha scrape'

app.get '/stats', (req, res) ->
  console.log 'GET /stats'
  res.json 'Stats'
  res.end

port = 3000 unless process.env.PORT?
app.listen port, ->
  console.log 'Listening on port ' + port