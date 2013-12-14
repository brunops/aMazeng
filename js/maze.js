function Cell() {
  this.init();
}

Cell.prototype.init = function() {
  this.explored = false;

  this.leftWall    = 1;
  this.righttWall  = 1;
  this.topWall     = 1;
  this.bottomtWall = 1;
};

// ----------------------------------------------------

function Maze(size) {
  this.init(size);
}

Maze.prototype.init = function(size) {
  this.size = size;
  this.generateMaze();
};

Maze.prototype.generateMaze = function() {
  this.maze = [];

};
