// http service module
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var path = require('path')
var jade = require('jade')

// game modules
var reshuffle = require('./dist/reshuffle')
var suitSelector = require('./dist/suit-selector')

// template rendering
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// routes
app.get('/', function(req, res) {
  res.render('index.jade', { title: "Welcome to Paris." })
})
app.get('/room', function(req, res) {
  res.render('room.jade', { title: 'Please get seated.' })
})
app.get('/game', function(req, res) {
  res.render('game.jade', { title: 'Good luck!' })
})

// static file service
app.use(express.static(path.join(__dirname, 'public')))

// request listening
var host = (process.env.VCAP_APP_HOST || 'localhost')
var port = (process.env.VCAP_APP_PORT || 80)
server.listen(port, host)