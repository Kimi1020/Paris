// Shuffle three times
function reshuffle() {
  // Types: 1 -> Spade ♠, 2 -> Heart ♥, 3 -> Club ♣, 4 -> Diamond ♦
  // Values: a -> 10, b -> Jack, c -> Queen, d -> King, e -> Ace
  var deck = ['12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e',
              '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e',
              '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e',
              '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e']

  return shuffle(shuffle(shuffle(deck)))
}

// Fisher Yates Shuffle Algorithm
function shuffle(arr) {
  var i = arr.length
  var j
  var temp

  if(i > 1) {
    while(--i) {
      j = Math.floor(Math.random() * (i + 1))
      temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
  }
  return arr
}

module.exports = reshuffle
