var socket = io();

document.getElementById('start').addEventListener('click', function(e) {
  if(!document.getElementById('name').value.length) {
    alert('名前を入力してください');
  } else {
    var name = document.getElementById('name').value
    var message = document.getElementById('message').value
    const uri = window.location.origin
    socket.emit('start', name);
    axios.post(uri + '/api/players', {
        name: name,
        message: message,
      })
      .then(function(res) {
        axios.get(uri + '/api/players')
          .then(function(res) {
            res.data.reverse().forEach(function(player) {
              console.log(player.name)
              if(player.name == name) {
                window.location.href = uri + '/players/' + player._id;
              }
            });
          })
          .catch(function(err) {
            console.log(err);
          })
      })
   }
})
