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

  this.isRunning = false;
  this.mazeSize = 10;

  this.socket = io.connect(window.location.origin);

  this.bindEvents();
};

Game.prototype.bindEvents = function() {
  var game = this;

  $(document).on('keydown', this.handlePlayerMoves.bind(this));

  $(window).unload(function() {
    game.socket.emit('disconnect');
  });

  this.socket.on('enemy-move', function(data) {
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

    game.isRunning = true;
  });

  this.socket.on('define-maze', function(data) {
    console.log('"define-maze" event received');

    var maze = data.maze,
        mazeSize = maze.maze[0].length;

    game.playerMaze = new Maze(mazeSize, maze);
    game.enemyMaze = new Maze(mazeSize, maze);

    game.renderPlayerMaze();
    game.renderEnemyMaze();

    game.isRunning = true;
  });

  this.socket.on('won', function() {
    if (!game.isRunning) return;

    game.isRunning = false;
    $('h1').after($('<p class="you-won">You won!</p>').append(this.getPlayAgainMsg()));
  });

  this.socket.on('lost', function() {
    if (!game.isRunning) return;

    game.isRunning = false;
    $('h1').after($('<p class="you-lost">You lost!</p>').append(game.getPlayAgainMsg()));
  });
};

Game.prototype.handlePlayerMoves = function(e) {
  if (!this.isRunning) return;

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

  if (this.playerMaze.isWinner()) {
    this.socket.emit('won');
    this.isRunning = false;
    $('h1').after($('<p class="you-won">You won!</p>').append(this.getPlayAgainMsg()));
  }
};

Game.prototype.renderPlayerMaze = function() {
  $('#player .maze-content').empty();
  $('#player .maze-content').append(this.playerMaze.render());
};

Game.prototype.renderEnemyMaze = function() {
  $('#enemy .maze-content').empty();
  $('#enemy .maze-content').append(this.enemyMaze.render());
};

Game.prototype.getPlayAgainMsg = function() {
  var game = this;
  var playAgain = $('<p><a href="#">Click here to play again!</a></p>');

  // Reconnect
  playAgain.on('click', function() {
    game.socket.emit('disconnect');
    location.reload();
  });

  return playAgain;
};
