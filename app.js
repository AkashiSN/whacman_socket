const fs         = require('fs')
const express    = require('express')
const app        = express()
const http       = require('http').Server(app)
const io         = require('socket.io')(http)
const bodyParser = require('body-parser')
const axios = require('axios')
var status = false
var player_id = null

const sortByKey= (data, key) => {
  data = data.sort((a, b) => {
    let x = a[key]
    let y = b[key]
    if(x > y) return -1
    if(x < y) return 1
    return 0
  })
  return data
}

// DBへの接続
const MONGO_URL     = process.env.MONGODB_URI || 'mongodb://localhost/jsonAPI'
const mongoose      = require('mongoose')
const autoIncrement = require("mongoose-auto-increment")
const db            = mongoose.connect(MONGO_URL)
autoIncrement.initialize(db)
const PlayerSchema  = require('./models/player')
PlayerSchema.pre("save", function(next){
  this.date = new Date()
  next()
})
PlayerSchema.plugin(autoIncrement.plugin, 'Test')
const Player = mongoose.model('Player', PlayerSchema)

Player.find((err, players) => {
  if (players.length === 0){
    var player = new Player()
    player.name = "test"
    player.message = "test"
    player.score = 0
    player.save()
  }
});

// POSTでdataを受け取るための記述
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/images', express.static('images'))

app.get('/api/players', (req, res) => {
  Player.find((err, players) => {
    if(err) res.send(err)
    res.json(players)
  })
})

app.get('/api/players/ranking', (req, res) => {
  Player.find((err, players) => {
    if(err) res.send(err)
    res.json(sortByKey(players, 'score').slice(0, 20))
  })
})

app.post('/api/players', (req, res) => {
  var player = new Player()

  player.name = req.body.name
  player.message = req.body.message
  player.score = 0

  player.save(function(err) {
    if(err) res.send(err)
    res.json(player)
  })
})

app.get('/api/players/:player_id', (req, res) => {
  Player.findById(req.params.player_id, (err, player) => {
    if(err) res.send(err)
    res.json(player)
  })
})

app.put('/api/players/:player_id', (req, res) => {
  if (!status)
  res.json({message: 'time out'})
  else if (!(player_id === req.params.player_id)){
    res.json({message: 'game has ended'})
  }
  else{
    Player.findById(req.params.player_id, (err, player) => {
      if(err) res.send(err)
      player.name = req.body.name || player.name
      if(req.body.hit)
        player.score = player.score + 100
      player.save((err) => {
        if(err) res.send(err)
        res.json({ message: 'Player updated!' })
      })
      io.emit('reflect scores', player)
    })
  }
})

app.delete('/api/players/:player_id', (req, res) => {
  Player.remove({
    _id: req.params.player_id
  }, (err, user) => {
    if(err) res.send(err)
    res.json({ message: 'Successfully deleted' })
  })
})

app.get('/', (req, res) => {
  res.sendfile('start.html')
})

app.get('/players/ranking', (req, res) => {
  res.sendfile('ranking.html')
})

app.get('/players/:player_id', (req, res) => {
  res.sendfile('index.html')
})

io.on('connection', (socket) => {
  socket.on('reflect scores', (msg) => {
    io.emit('reflect scores', msg)
  })

  socket.on('start', (msg, id) => {
    status = true
    player_id = id
    axios.post('http://localhost:4000/api/timer', {
      start: 1,
      player_id: id
    })
      .then((res) => {
        console.log('start success')
      })
      .catch((err) => {
        console.log(err)
      })
    console.log('start', msg, id)
  })

  socket.on('stop', (msg) => {
    status = false
    player_id = -1
    axios.post('http://localhost:4000/api/timer', {
      stop: 1
    })
      .then((res) => {
        console.log('stop success')
      })
      .catch((err) => {
        console.log(err)
      })
    console.log('stop', msg)
  })
})

var port = process.env.PORT || 3000
http.listen(port, () => {
  console.log('listening on *:', port)
})
