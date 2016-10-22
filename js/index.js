const playerId = window.location.pathname.match(/\/players\/(.*)/)[1]
const uri = window.location.origin
axios.get(uri + '/api/players/' + playerId)
  .then(function(res) {
    setPlayerInfo(res.data);
  })
  .catch(function(err) {
    console.log(err);
  })
var socket = io();
socket.on('reflect scores', function(player) {
  if(player._id == playerId) {
    setPlayerInfo(player);
  }
});

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
};

function setPlayerInfo(player) {
  document.getElementById('js-name').innerHTML = escapeHTML(player.name);
  document.getElementById('js-message').innerHTML = escapeHTML(player.message) || 'がんばるぞい！';
  document.getElementById('js-score').innerHTML = player.score.toLocaleString();
}

function formatTime(mseconds) {
  let msec = Math.floor(mseconds % 100)
  let sec  = Math.floor(mseconds / 100)
  if(msec < 10) { msec = '0' + msec }
  if(sec < 10) { sec = '0' + sec }
  return sec + "''" + msec
}

function countDown(count) {
  socket.emit('start', 1);
  var timer = document.getElementById('timer');
  var countup = function() {
    timer.innerHTML = formatTime(count--);
  }
  var id = setInterval(function() {
    countup();
    if(count < 0) {
      clearInterval(id);
      socket.emit('stop', 1);
      blink(timer, 10);
      document.getElementById('js-clear').innerHTML = 'CLEAR!';
    }
  }, 10);
}

function blink(target, limit) {
  var count = 0;
  var countup = function() {
    if(target.style.visibility == 'visible') {
      target.style.visibility = 'collapse';
    } else {
      target.style.visibility = 'visible';
    }
    count++;
  }
  var id = setInterval(function() {
    countup();
    if(count > limit) {
      clearInterval(id);
    }
  }, 200);
}

countDown(6000);

// TODO:
// カウントダウン開始時にAPI叩く
// カウントダウン終了時にAPI叩く
