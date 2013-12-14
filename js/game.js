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

  this.mazeSize = 15;

  this.playerMaze = new Maze(this.mazeSize);
  this.enemyMaze = new Maze(this.mazeSize, this.playerMaze);

  this.socket = io.connect('http://localhost:3000');

  this.bindEvents();

  this.renderPlayerMaze();
  this.renderEnemyMaze();
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
