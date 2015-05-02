// (9 00 00 00 00 00) Royal Flush     皇家同花顺
// (8 00 00 00 00 00) Straight Flush  同花顺
// (7 00 00 00 00 00) Four of a Kind  四条
// (6 00 00 00 00 00) Fullhouse       葫芦
// (5 00 00 00 00 00) Flush           同花
// (4 00 00 00 00 00) Straight        顺子
// (3 00 00 00 00 00) Three of a Kind 三条
// (2 00 00 00 00 00) Two Pairs       两对
// (1 00 00 00 00 00) One Pair        一对
// (0 00 00 00 00 00) High Card       高牌

// Pick up 5 cards out of 7 of the biggest suit
function suitSelector(cards) {
  var combinations = getCombinations(cards, 5)
  var biggestSuit = { level: 0 }
  var suit

  for(var i = 0; i < combinations.length; i++) {
    suit = detectSuit(combinations[i])

    if(suit.grade == 9) {
      // Royal Flush
      return suit
    }

    if(suit.level > biggestSuit.level) {
      biggestSuit = suit
    }
  }

  return biggestSuit
}

// List all possible combinations out of existing collection
// For this game, maximum of C(7, 5), 21
function getCombinations(collection, count) {
  if(count >= collection.length) {
    return [collection]
  }

  var all = []

  void function recursion(arr, size, result) {
    var len = arr.length

    if(size > len) {
      return
    }
    if(size == len) {
      all.push([].concat(result, arr))
    }
    if(size < len) {
      for(var i = 0; i < len; i++) {
        var newResult = [].concat(result)
        newResult.push(arr[i])

        if(size == 1) {
          all.push(newResult)
        } else {
          var newArr = [].concat(arr)
          newArr.splice(0, i + 1)
          recursion(newArr, size - 1, newResult)
        }
      }
    }
  }(collection, count, [])

  return all
}

function detectSuit(cards) {
  var result

  cards.sort(function(a, b) {
    return (parseInt(a[1], 16) - parseInt(b[1], 16)) || (parseInt(a[0], 10) - parseInt(b[0], 10))
  })

  if(result = detectStraightFlush(cards)) {
    return result
  }

  if(result = detectFour(cards)) {
    return result
  }

  if(result = detectFullhouse(cards)) {
    return result
  }

  if(result = detectFlush(cards)) {
    return result
  }

  if(result = detectStraight(cards)) {
    return result
  }

  return detectLowSuits(cards)
}

// Straight Flush 同花顺
// Royal Flush 皇家同花顺 is a special kind of straight flush, with a kicker of 10
function detectStraightFlush(cards) {
  if(cards.length < 5) {
    return null
  }

  var grade = 0
  var level = 0
  var straight = detectStraight(cards)

  if(straight && detectFlush(cards)) {
    if(/10$/.test(straight.level)) {
      // Royal Flush 皇家同花顺
      grade = 9
      level = straight.level + 5 * Math.pow(100, 5)
    } else {
      // Straight Flush 同花顺
      grade = 8
      level = straight.level + 4 * Math.pow(100, 5)
    }
    return { grade: grade, level: level, suit: cards }
  }

  return null
}

// Four of a Kind 四条
function detectFour(cards) {
  var hash = {}
  var four = []
  var kickers = []
  var level = 0

  cards.forEach(function(card) {
    var val = card[1]
    if(val in hash) {
      hash[val]++
    } else {
      hash[val] = 1
    }
  })

  Object.keys(hash).forEach(function(val) {
    switch(hash[val]) {
      case 4:
        four.push(parseInt(val, 16))
        break
      case 1:
        kickers.push(parseInt(val, 16))
        break
    }
  })

  if(four.length == 1) {
    level = 7 * Math.pow(100, 5) + four[0] * Math.pow(100, 4)
    if(kickers.length > 0) {
      level += kickers[0]
    }
    return { grade: 7, level: level, suit: cards }
  }

  return null
}

// Fullhouse 葫芦
function detectFullhouse(cards) {
  if(cards.length < 5) {
    return null
  }

  var hash = {}
  var three = []
  var pairs = []
  var level = 0

  cards.forEach(function(card) {
    var val = card[1]
    if(val in hash) {
      hash[val]++
    } else {
      hash[val] = 1
    }
  })

  Object.keys(hash).forEach(function(val) {
    switch(hash[val]) {
      case 3:
        three.push(parseInt(val, 16))
        break
      case 2:
        pairs.push(parseInt(val, 16))
        break
    }
  })

  if(three.length == 1 && pairs.length == 1) {
    level = 6 * Math.pow(100, 5) + three[0] * Math.pow(100, 4) + pairs[0] * Math.pow(100, 3)
    return { grade: 6, level: level, suit: cards }
  } else {
    return null
  }
}

// Flush 同花
function detectFlush(cards) {
  if(cards.length < 5) {
    return null
  }

  var hash = {}
  var kickers = []
  var level = 5 * Math.pow(100, 5)

  cards.forEach(function(card, i) {
    hash[card[0]] = true
    kickers.push(parseInt(card[1], 16))
  })

  if(Object.keys(hash).length > 1) {
    return null
  }

  kickers.sort(function(a, b) {
    return a - b
  }).forEach(function(kicker, i) {
    level += kicker * Math.pow(100, i)
  })

  return { grade: 5, level: level, suit: cards }
}

// Straight 顺子
function detectStraight(cards) {
  if(cards.length < 5) {
    return null
  }

  var kickers = []
  var level = 0

  cards.forEach(function(card) {
    kickers.push(parseInt(card[1], 16))
  })

  kickers.sort(function(a, b) {
    return a - b
  })

  // use Ace as 1
  if(kickers[0] == 2 && kickers[4] == 14) {
    kickers.pop()
    kickers.unshift(1)
  }

  for(var i = 1; i < kickers.length; i++) {
    if(kickers[i] - kickers[i - 1] == 1) {
      continue
    }
    return null
  }

  level = 4 * Math.pow(100, 5) + kickers[0]

  return { grade: 4, level: level, suit: cards }
}

// Low suits consist of four types:
// (1) Three of a Kind 三条
// (2) Two Pairs 两对
// (3) One Pair 一对
// (4) High Card 高牌
function detectLowSuits(cards) {
  var hash = {}
  var three = []
  var pairs = []
  var kickers = []
  var grade = 0
  var level = 0

  cards.forEach(function(card) {
    var val = card[1]
    if(val in hash) {
      hash[val]++
    } else {
      hash[val] = 1
    }
  })

  Object.keys(hash).forEach(function(val) {
    switch(hash[val]) {
      case 3:
        three.push(parseInt(val, 16))
        break
      case 2:
        pairs.push(parseInt(val, 16))
        break
      case 1:
        kickers.push(parseInt(val, 16))
        break
    }
  })

  if(three.length == 1) {
    // Three of a Kind 三条
    grade = 3
    level = 3 * Math.pow(100, 5) + three[0] * Math.pow(100, 4)
  }

  switch(pairs.length) {
    case 2: // Two Pairs 两对
      grade = 2
      level = 2 * Math.pow(100, 5)
      pairs.sort(function(a, b) {
        return a - b
      }).forEach(function(pair, i) {
        level += pair * Math.pow(100, i + 3)
      })
      break
    case 1: // One Pair 一对
      grade = 1
      level = Math.pow(100, 5) + pairs[0] * Math.pow(100, 4)
      break
  }

  kickers.sort(function(a, b) {
    return a - b
  }).forEach(function(kicker, i) {
    level += kicker * Math.pow(100, i)
  })

  return { grade: grade, level: level, suit: cards }
}

module.exports = suitSelector
