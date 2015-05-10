void function(window, document, undefined) {
  var proto = Object.create(HTMLElement.prototype)

  proto.createdCallback = function() {
    console.log('create card component')
    var link = document.querySelector('link.component.card')
    var template = link.import.querySelector('template')
    var templateContent = template.content.cloneNode(true)

    var TYPES = {1: '♠', 2: '♥', 3: '♣', 4: '♦'}
    var VALUES = {2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '10', b: 'J', c: 'Q', d: 'K', e: 'A' }

    var card = this.dataset.card
    var color = TYPES[card[0]]
    var value = VALUES[card[1]]

    var root = this.createShadowRoot()
    root.appendChild(templateContent)
    root.querySelector('.color').innerHTML = color
    root.querySelector('.value').innerHTML = value
  }

  var TexasCard = document.registerElement('texas-card', {
    prototype: proto
  })

  window.HTMLTexasCardElement = TexasCard
}(window, document)