void function(window, document, undefined) {
  var player = sessionStorage.getItem('player')
  var form = document.querySelector('form')
  var p = document.querySelector('p')
  var input = document.querySelector('#inputbox')

  p.addEventListener('animationend', function(e) {
    p.classList.remove('shaking')
    input.focus()
  }, false)

  form.addEventListener('submit', function(e) {
    if(!input.value) {
      p.classList.add('shaking')
      e.preventDefault()
    }
    sessionStorage.setItem('player', input.value)
  }, false)

  if(player) {
    input.value = player
  }
}(window, document)
