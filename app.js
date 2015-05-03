// service modules
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var bodyParser = require('body-parser')
var jade = require('jade')
var path = require('path')

// game modules
var lang = require('./modules/lang')
var reshuffle = require('./modules/reshuffle')
var suitSelector = require('./modules/suit-selector')


// service setting
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// template rendering setting
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


// routes
app.get('/', function(req, res) {
  res.render('texas', lang)
})
app.get('/*', function(req, res) {
  res.redirect('/')
})

players = {}

// web socket
io.of('/texas').on('connection', function(player) {
  // home
  player.on('home.enterRoom', function(data) {
    console.log('home.enterRoom', data)
    var playerStatus = players[player.id] = {name: data.name, cash: 10000, id: player.id}
    player.emit('home.enteredRoom', playerStatus)
  })

  // room
  player.on('room.joinGame', function(data) {
    console.log('room.joinGame', data)
    var playerStatus = players[data.id]
    playerStatus.game = data.game
    playerStatus.seat = data.seat
    player.emit('room.joinedGame', playerStatus)
  })

  player.on('room.exitRoom', function(data) {
    console.log('room.exitRoom', data)
    players[data.id] = null
    player.emit('room.exitedRoom', {id: data.id})
  })

  // game
  player.on('game.exitGame', function(data) {
    console.log('game.exitGame', data)
    var playerStatus = players[data.id]
    playerStatus.game = -1
    playerStatus.seat = -1
    playerStatus.ready = false
    player.emit('game.exitedGame', playerStatus)
  })

  player.on('game.startGame', function(data) {
    console.log('game.startGame', data)
    var playerStatus = players[data.id]
    playerStatus.ready = true
    player.emit('game.startedGame', playerStatus) // TODO: emit on all players ready
  })

  player.emit('home.connected', {id: player.id})
})


// serving
var host = (process.env.VCAP_APP_HOST || 'localhost')
var port = (process.env.VCAP_APP_PORT || 80)
server.listen(port, host)