const playerId = window.location.pathname.match(/\/players\/(.*)/)[1]
const uri = window.location.origin

const footer = document.getElementById('footer')
footer.style.display = 'none'

axios.get(uri + '/api/players/' + playerId)
  .then((res) => {
    setPlayerInfo(res.data)
  })
  .catch((err) => {
    console.log(err)
  })
const socket = io()
socket.on('reflect scores', (player) => {
  if(player._id == playerId)
    setPlayerInfo(player)
})

const escapeHTML = (str) => {
  return str.replace(/&/g, '&amp')
            .replace(/</g, '&lt')
            .replace(/>/g, '&gt')
            .replace(/"/g, '&quot')
            .replace(/'/g, '&#39')
}

const setPlayerInfo = (player) => {
  document.getElementById('js-name').innerHTML = escapeHTML(player.name)
  document.getElementById('js-message').innerHTML = escapeHTML(player.message || 'がんばるぞい！')
  document.getElementById('js-score').innerHTML = player.score.toLocaleString()
}

const formatTime = (mseconds) => {
  let msec = Math.floor(mseconds % 100)
  let sec  = Math.floor(mseconds / 100)
  if(msec < 10) { msec = '0' + msec }
  if(sec < 10) { sec = '0' + sec }
  return sec + "''" + msec
}

const countDown = (count) => {
  socket.emit('start', 1, playerId)
  const timer = document.getElementById('timer')
  const countup = function() {
    timer.innerHTML = formatTime(count--)
  }
  const id = setInterval(function() {
    countup()
    if(count < 0) {
      clearInterval(id)
      socket.emit('stop', 1)
      blinkAndDisplayRank(timer, 10)
      document.getElementById('js-clear').innerHTML = 'CLEAR!'
    }
  }, 10)
}

const blinkAndDisplayRank = (target, limit) => {
  let count = 0
  const countup = () => {
    if(target.style.visibility == 'visible') {
      target.style.visibility = 'collapse'
    } else {
      target.style.visibility = 'visible'
    }
    count++
  }
  const id = setInterval(function() {
    countup()
    if(count > limit) {
      clearInterval(id)
      let score = document.getElementById('js-score').innerHTML
      axios.get(uri + '/api/players/ranking')
        .then((res) => {
          score = parseInt(score.split(',').join('').trim())
          res.data.some((player, i) => {
            if(player.score < score) {
              ranknum = i
              displayRank(ranknum, target)
              return true
            }
            const footer = document.getElementById('footer')
            footer.style.display = 'block'
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, 200)
}

const displayRank = (ranknum, target) => {
   document.getElementById('timelimit').innerHTML = 'RANKING'
   const unit = document.createElement('span')
   unit.innerHTML = ' 位'
   const rank = document.createElement('span')
   rank.className = 'num'
   rank.innerHTML = ranknum
   rank.appendChild(unit)
   target.innerHTML = ''
   target.appendChild(rank)
}

countDown(1000)
