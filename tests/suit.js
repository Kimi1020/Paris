var reshuffle = require('../dist/reshuffle')
var suitSelector = require('../dist/suit-selector')

var deck = reshuffle()
var cards = deck.filter(function(card, i){return i < 7})
console.log(cards)

var suit = suitSelector(cards)
console.log(suit)