var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket) {
  console.log('one dude connected');
  socket.on('enemy-move', function(data) {
    console.log('enemy move => ' + JSON.stringify(data));

    socket.broadcast.emit('enemy-move', data);
  });
});

