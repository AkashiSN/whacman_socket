const uri = window.location.origin

const reloadRanking = () => {
  axios.get(uri + '/api/players/ranking')
    .then((res) => {
      setRanking(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

const escapeHTML = (str) => {
  return str.replace(/&/g, '&amp')
            .replace(/</g, '&lt')
            .replace(/>/g, '&gt')
            .replace(/"/g, '&quot')
            .replace(/'/g, '&#39')
}

const setRanking = (players) => {
  const table = document.getElementById('ranking-table')
  table.innerHTML = ''

  Array.prototype.forEach.apply(
    players,
    [function(player, i ,a) {
      const result = document.createElement('li')
      const wrapper = document.createElement('div')
      wrapper.className = 'wrapper'
      const rank = document.createElement('div')
      rank.className = 'rank'
      const num = i + 1
      rank.innerHTML = num.toString()
      const score = document.createElement('div')
      score.className = 'score'
      score.innerHTML = player.score.toLocaleString()
      const name = document.createElement('div')
      name.className = 'name'
      name.innerHTML = escapeHTML(player.name || '')
      const message = document.createElement('div')
      message.className = 'message'
      message.innerHTML = escapeHTML(player.message || '')
      wrapper.appendChild(rank)
      wrapper.appendChild(score)
      wrapper.appendChild(name)
      wrapper.appendChild(message)
      result.appendChild(wrapper)
      table.appendChild(result)
    }]
  )
}

reloadRanking()

const socket = io()

socket.on('reflect scores', (player) => {
  reloadRanking()
})
