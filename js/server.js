var sio = require('socket.io');
var http = require('http');
var send = require('send');

var games = [];
var nextRoom = [];


var server = http.createServer(function(req, res) {
  send(req, req.url).root(__dirname + '/..').pipe(res);
});

server.listen(3000);
var io = sio.listen(server);

io.sockets.on('connection', function(socket) {
  var gameIndex = games.length;
  var enemySocketId;

  nextRoom.push(socket.id);

  // Enemy connected
  if (nextRoom.length == 2) {
    games.push(nextRoom);
    nextRoom = [];

    enemySocketId = enemySocketId || getEnemyFromRoom(games[gameIndex], socket.id);
    var enemySocket = io.sockets.socket(enemySocketId);

    enemySocket.emit('enemy-connected');
  }

  console.log(games);

  socket.on('maze-defined', function(data) {
    enemySocketId = enemySocketId || getEnemyFromRoom(games[gameIndex], socket.id);
    var enemySocket = io.sockets.socket(enemySocketId);

    enemySocket.emit('define-maze', { maze: data.maze });
  });

  socket.on('enemy-move', function(data) {
    enemySocketId = enemySocketId || getEnemyFromRoom(games[gameIndex], socket.id);

    io.sockets.socket(enemySocketId).emit('enemy-move', data);
  });

  socket.on('won', function(data) {
    enemySocketId = enemySocketId || getEnemyFromRoom(games[gameIndex], socket.id);

    io.sockets.socket(enemySocketId).emit('lost', { end: 'lost' });
  });

  socket.on('disconnect', function() {
    enemySocketId = enemySocketId || getEnemyFromRoom(games[gameIndex], socket.id);

    console.log('game finished => players: ' + JSON.stringify(games[gameIndex]));
    console.log('Socket id ' + socket.id + ' disconnected, send msg to socket ' + enemySocketId);

    io.sockets.socket(enemySocketId).emit('won', { end: 'won' });

    games.splice(gameIndex, 1);
  });
});

function getEnemyFromRoom(room, playerSocketId) {
  if (!room) return;
  return room[0] === playerSocketId ? room[1] : room[0];
}
