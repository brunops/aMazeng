function Game() {
  this.init();
}

Game.prototype.init = function() {
  this.keyCodes = {
    top:    38,
    right:  39,
    bottom: 40,
    left:   37
  };

  this.mazeSize = 10;

  // this.playerMaze = new Maze(this.mazeSize);
  // this.enemyMaze = new Maze(this.mazeSize, this.playerMaze);

  this.socket = io.connect('http://localhost:3000');

  this.bindEvents();

  // this.renderPlayerMaze();
  // this.renderEnemyMaze();
};

Game.prototype.bindEvents = function() {
  var game = this;

  $(document).on('keydown', this.handlePlayerMoves.bind(this));

  this.socket.on('enemy-move', function(data) {
    console.log(data)

    switch (data.move) {
      case 'TOP':
        game.enemyMaze.movePlayerTop();
        break;
      case 'RIGHT':
        game.enemyMaze.movePlayerRight();
        break;
      case 'BOTTOM':
        game.enemyMaze.movePlayerBottom();
        break;
      case 'LEFT':
        game.enemyMaze.movePlayerLeft();
        break;
    }

    game.renderEnemyMaze();
  });

  this.socket.on('enemy-connected', function(data) {
    console.log('enemy-connected');

    game.playerMaze = new Maze(game.mazeSize);
    game.enemyMaze = new Maze(game.mazeSize, game.playerMaze);

    game.renderPlayerMaze();
    game.renderEnemyMaze();

    game.socket.emit('maze-defined', { maze: game.playerMaze }, function(data) {
      console.log('enemy maze defined');
    });
  });


  // this.socket.on('get-maze', function() {
  //   console.log('request for maze received => "get-maze" event, emitting "maze"');
  //   this.socket.emit('maze', { maze: game.playerMaze });
  // });

  this.socket.on('define-maze', function(data) {
    console.log('"define-maze" event received');

    var maze = data.maze,
        mazeSize = maze.maze[0].length;

    console.log('define maze => ' + JSON.stringify(maze));
    console.log('maze size => ' + mazeSize);


    game.playerMaze = new Maze(mazeSize, maze);
    game.enemyMaze = new Maze(mazeSize, maze);

    game.renderPlayerMaze();
    game.renderEnemyMaze();

    console.log('rendered!')
  });

  this.socket.on('won', function() {
    console.log('won');
  });

  this.socket.on('lost', function() {
    console.log('lost');
  });
};

Game.prototype.handlePlayerMoves = function(e) {
  switch (e.keyCode) {
    case this.keyCodes.top:
      e.preventDefault();
      this.playerMaze.movePlayerTop();
      this.socket.emit('enemy-move', { move: 'TOP' });
      break;
    case this.keyCodes.right:
      e.preventDefault();
      this.playerMaze.movePlayerRight();
      this.socket.emit('enemy-move', { move: 'RIGHT' });
      break;
    case this.keyCodes.bottom:
      e.preventDefault();
      this.playerMaze.movePlayerBottom();
      this.socket.emit('enemy-move', { move: 'BOTTOM' });
      break;
    case this.keyCodes.left:
      e.preventDefault();
      this.playerMaze.movePlayerLeft();
      this.socket.emit('enemy-move', { move: 'LEFT' });
      break;
  }

  this.renderPlayerMaze();
};

Game.prototype.renderPlayerMaze = function() {
  $('#player .maze').remove();
  $('#player').append(this.playerMaze.render());
};

Game.prototype.renderEnemyMaze = function() {
  $('#enemy .maze').remove();
  $('#enemy').append(this.enemyMaze.render());
};
