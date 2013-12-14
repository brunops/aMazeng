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

      break;
    case this.keyCodes.right:

      break;
    case this.keyCodes.bottom:

      break;
    case this.keyCodes.left:

      break;
  }
};

Game.prototype.render = function() {
  $('.maze').empty();

  $('body').append(maze);
};
