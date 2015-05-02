var reshuffle = require('../dist/reshuffle')
var suitSelector = require('../dist/suit-selector')

var deck = reshuffle()

function humanize(cards) {
  var TYPES = {1: '♠', 2: '♥', 3: '♣', 4: '♦'}
  var VALUES = {2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', a: '10', b: 'J', c: 'Q', d: 'K', e: 'A' }
  var GRADES = {
    9: '皇家同花顺 Royal Flush',
    8: '同花顺 Straight Flush',
    7: '四条Four of a Kind',
    6: '葫芦 Fullhouse',
    5: '同花 Flush',
    4: '顺子 Straight',
    3: '三条 Three of a Kind',
    2: '两对 Two Pairs',
    1: '一对 One Pair',
    0: '高牌 High Card'
  }

  if(Array.isArray(cards)) {
    return cards.map(function(card) {
      return TYPES[card[0]] + ' ' + VALUES[card[1]]
    })
  } else {
    return {
      grade: GRADES[cards.grade],
      suit: cards.suit.map(function(card) {
        return TYPES[card[0]] + ' ' + VALUES[card[1]]
      })
    }
  }
}

var cards = deck.filter(function(card, i){return i < 7})
console.log(humanize(cards))

var biggest = suitSelector(cards)
console.log(humanize(biggest))