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

  this.mazeSize = 20;

  this.playerMaze = new Maze(this.mazeSize);
  this.enemyMaze = new Maze(this.mazeSize);

  this.bindEvents();
};

Game.prototype.bindEvents = function() {
  $(document).on('keydown', this.handlePlayerMoves.bind(this));
};

Game.prototype.handlePlayerMoves = function(e) {
  switch (e.keyCode) {
    case this.keyCodes.top:
      this.playerMaze.movePlayerTop();
      break;
    case this.keyCodes.right:
      this.playerMaze.movePlayerRight();
      break;
    case this.keyCodes.bottom:
      this.playerMaze.movePlayerBottom();
      break;
    case this.keyCodes.left:
      this.playerMaze.movePlayerLeft();
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
  $('#enemy').append(this.playerMaze.render());
};
