void function(window, document, undefined) {
  var player = io.connect('/texas')

  player.on('response', function (data) {
    console.log(data)
  })

  player.on('connected', function (data) {
    if(data) {
      console.log('web socket connected')
      player.emit('request', 'test')
    }
  })


}(window, document)
