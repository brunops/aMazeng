function Game() {
  this.init();
}

Game.prototype.init = function() {
  this.mazeSize = 20;
  this.maze = new Maze(this.mazeSize);


  this.bindEvents();


  this.keyCodes = {
    top:    38,
    right:  39,
    bottom: 40,
    left:   37
  };
};



Game.prototype.bindEvents = function() {
  $(document).on('keydown', this.handlePlayerMoves.bind(this));
};

Game.prototype.handlePlayerMoves = function(e) {
  switch (e.keyCode) {
    case this.keyCodes.top:
      if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['TOP'] === false) {
        this.setPlayerPosition(this.playerRowPos - 1, this.playerColPos);
        this.render();
      }
      break;
    case this.keyCodes.right:
      if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['RIGHT'] === false) {
        this.setPlayerPosition(this.playerRowPos, this.playerColPos + 1);
        this.render();
      }
      break;
    case this.keyCodes.bottom:
      if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['BOTTOM'] === false) {
        this.setPlayerPosition(this.playerRowPos + 1, this.playerColPos);
        this.render();
      }
      break;
    case this.keyCodes.left:
      if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['LEFT'] === false) {
        this.setPlayerPosition(this.playerRowPos, this.playerColPos - 1);
        this.render();
      }
      break;
  }
};

Game.prototype.render = function() {
  $('.maze').empty();

  $('body').append(maze);
};
