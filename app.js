// service modules
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var bodyParser = require('body-parser')
var jade = require('jade')
var path = require('path')

// game modules
var lang = require('./dist/lang')
var reshuffle = require('./dist/reshuffle')
var suitSelector = require('./dist/suit-selector')


// service setting
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

// template rendering setting
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


// routes
app.get('/', function(req, res) {
  res.render('index', lang.index)
})

app.get('/*', function(req, res) {
  res.redirect('/')
})

app.post('/room', function(req, res) {
  lang.room.player = { name: req.body.name, cash: req.body.cash }
  res.render('room', lang.room)
})

app.post('/game', function(req, res) {
  lang.game.player = { name: req.body.name, cash: req.body.cash }
  res.render('game', lang.game)
})


// web socket
io.of('/texas').on('connection', function(player) {
  player.on('request', function(data) {
    if(data == 'test') {
      player.emit('response', 'web socket test success')
    }
  })

  player.emit('connected', true)
})


// serving
var host = (process.env.VCAP_APP_HOST || 'localhost')
var port = (process.env.VCAP_APP_PORT || 80)
server.listen(port, host)