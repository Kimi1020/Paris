void function(window, document, undefined) {

// namespace
var TEXAS = {
  player: null, // socket io instance
  status: null, // player status { name: 'player name', cash: 10000, game: 'table id', socket: 'web socket id' }
  HOME: {},     // home view namespace
  ROOM: {},     // room view namespace
  GAME: {}      // game view namespace
}

function init() {
  window.onbeforeunload = function() {
    // return '强制退出可能导致游戏断线'
  }

  setupSocket()

  initHome()
  initRoom()
  initGame()

  transition('home', 'TEXAS')
}

function transition(view, from) {
  ({home: reinitHome, room: reinitRoom, game: reinitGame}[view])()
  document.body.className = view
  console.log(from + ' -> ' + view)
}

function setupSocket() {
  var player = TEXAS.player = io.connect('/texas')

  // home
  player.on('home.connected', function (data) {
    console.log('home.connected', data)
    TEXAS.status = data
  })

  player.on('home.enteredRoom', function (data) {
    console.log('home.enteredRoom', data)
    TEXAS.status = data
    transition('room', 'home')
  })

  // room
  player.on('room.joinedGame', function (data) {
    console.log('room.joinedGame', data)
    TEXAS.status = data
    transition('game', 'room')
  })

  player.on('room.exitedRoom', function (data) {
    console.log('room.exitedRoom', data)
    TEXAS.status = null
    transition('home', 'room')
  })

  // game
  player.on('game.exitedGame', function (data) {
    console.log('room.exitedGame', data)
    TEXAS.status = data
    transition('room', 'game')
  })

  player.on('game.startedGame', function (data) {
    console.log('room.startedGame', data)
    TEXAS.status = data
    alert(JSON.stringify(TEXAS.status, null, 4))// TODO hard work
  })

}

function initHome() {
  var view = TEXAS.HOME.view = document.querySelector('#home')
  var form = TEXAS.HOME.form = view.querySelector('form')
  var p = TEXAS.HOME.p = view.querySelector('p')
  var input = TEXAS.HOME.input = view.querySelector('input')

  p.addEventListener('animationend', function(e) {
    p.classList.remove('shaking')
    input.focus()
  }, false)

  form.addEventListener('submit', function(e) {
    e.preventDefault()
    var name = input.value.trim()
    if(!name) {
      input.value = ''
      p.classList.add('shaking')
      return false
    }
    localStorage.setItem('player', name)

    console.log('home.enterRoom')
    TEXAS.player.emit('home.enterRoom', {name: name})
  }, false)

  input.value = localStorage.getItem('player') || ''
}

function reinitHome() {
  TEXAS.HOME.input.value = localStorage.getItem('player') || ''
}

function initRoom() {
  var view = TEXAS.ROOM.view = document.querySelector('#room')
  var nameSpan = TEXAS.ROOM.nameSpan = view.querySelector('.name')
  var cashSpan = TEXAS.ROOM.cashSpan = view.querySelector('.cash')
  var joinButton = TEXAS.ROOM.joinButton = view.querySelector('.join')
  var exitButton = TEXAS.ROOM.exitButton = view.querySelector('.exit')

  joinButton.addEventListener('click', function(e) {
    console.log('room.joinGame')
    // fake data here, join game 3, seat 2
    TEXAS.status.game = 3
    TEXAS.status.seat = 2
    TEXAS.player.emit('room.joinGame', TEXAS.status)
  }, false)

  exitButton.addEventListener('click', function(e) {
    console.log('room.exitRoom')
    TEXAS.player.emit('room.exitRoom', TEXAS.status)
  }, false)
}

function reinitRoom() {
  TEXAS.ROOM.nameSpan.innerHTML = TEXAS.status.name
  TEXAS.ROOM.cashSpan.innerHTML = TEXAS.status.cash
}

function initGame() {
  var view = TEXAS.GAME.view = document.querySelector('#game')
  var nameSpan = TEXAS.GAME.nameSpan = view.querySelector('.name')
  var cashSpan = TEXAS.GAME.cashSpan = view.querySelector('.cash')
  var startButton = TEXAS.GAME.startButton = view.querySelector('.start')
  var exitButton = TEXAS.GAME.exitButton = view.querySelector('.exit')

  startButton.addEventListener('click', function(e) {
    console.log('game.startGame')
    TEXAS.player.emit('game.startGame', TEXAS.status)
  }, false)

  exitButton.addEventListener('click', function(e) {
    console.log('game.exitGame')
    TEXAS.player.emit('game.exitGame', TEXAS.status)
  }, false)
}

function reinitGame() {
  TEXAS.GAME.nameSpan.innerHTML = TEXAS.status.name
  TEXAS.GAME.cashSpan.innerHTML = TEXAS.status.cash
}

window.onload = init

}(window, document)
