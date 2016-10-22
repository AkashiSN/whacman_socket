const uri = window.location.origin

function reloadRanking() {
  axios.get(uri + '/api/players/ranking')
    .then(function(res) {
      setRanking(res.data);
    })
    .catch(function(err) {
      console.log(err);
    })
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
};

function setRanking(players) {
  var table = document.getElementById('ranking-table')
    table.innerHTML = ''

  Array.prototype.forEach.apply(
    players,
    [function(player, i ,a) {
      var result = document.createElement('li')
      var wrapper = document.createElement('div')
      wrapper.className = 'wrapper'
      var rank = document.createElement('div')
      rank.className = 'rank'
      var num = i + 1
      rank.innerHTML = num.toString()
      var score = document.createElement('div')
      score.className = 'score'
      score.innerHTML = player.score
      var name = document.createElement('div')
      name.className = 'name'
      name.innerHTML = escapeHTML(player.name || '')
      var message = document.createElement('div')
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

reloadRanking();

var socket = io();

socket.on('reflect scores', function(player) {
  reloadRanking();
});
