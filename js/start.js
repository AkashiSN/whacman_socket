const socket = io()

document.getElementById('start').addEventListener('click', (e) => {
  if(!document.getElementById('name').value.length) {
    alert('名前を入力してください')
  } else {
    const name = document.getElementById('name').value
    const message = document.getElementById('message').value
    const uri = window.location.origin
    axios.post(uri + '/api/players', {
        name: name,
        message: message,
      })
      .then((res) => {
        console.log(res.data)
        var player = res.data
        if(player.name == name) {
          window.location.href = uri + '/players/' + player._id
        }
      })
   }
})
