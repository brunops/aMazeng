var WALLS = {
  0: 'TOP',
  1: 'RIGHT',
  2: 'BOTTOM',
  3: 'LEFT'
};

function Cell() {
  this.init();
}

Cell.prototype.init = function() {
  this.explored = false;

  this.walls = {
    'TOP'   : true,
    'RIGHT' : true,
    'BOTTOM': true,
    'LEFT'  : true
  };
};

// ----------------------------------------------------

function Maze(size) {
  this.init(size);
}

Maze.prototype.init = function(size) {
  this.size = size;
  this.generateMaze();

  this.setPlayerPosition(0, 0);
};

Maze.prototype.generateMaze = function() {
  this.maze = [];

  for (var i = 0; i < this.size; ++i) {
    this.maze.push([]);
    for (var j = 0; j < this.size; j++) {
      this.maze[i].push(new Cell());
    }
  }

  this.dfs();
};

Maze.prototype.dfs = function(row, col) {
  if (typeof row === 'undefined' || typeof col === 'undefined') {
    row = Math.floor(Math.random() * this.size);
    col = Math.floor(Math.random() * this.size);
  }

  var currentCell = this.maze[row][col];
  currentCell.explored = true;

  var orderToExplore = this.getRandomOrder();

  while (orderToExplore.length) {
    var nextCell;

    switch (WALLS[orderToExplore.pop()]) {
      case 'TOP':
        if (row - 1 < 0) break;

        nextCell = this.maze[row - 1][col];

        // remove walls between cells
        if (!nextCell.explored) {
          currentCell.walls['TOP'] = false;
          nextCell.walls['BOTTOM'] = false;

          this.dfs(row - 1, col);
        }
        break;

      case 'RIGHT':
        if (col + 1 >= this.size) break;

        nextCell = this.maze[row][col + 1];

        // remove walls between cells
        if (!nextCell.explored) {
          currentCell.walls['RIGHT'] = false;
          nextCell.walls['LEFT'] = false;

          this.dfs(row, col + 1);
        }
        break;

      case 'BOTTOM':
        if (row + 1 >= this.size) break;

        nextCell = this.maze[row + 1][col];

        // remove walls between cells
        if (!nextCell.explored) {
          currentCell.walls['BOTTOM'] = false;
          nextCell.walls['TOP'] = false;

          this.dfs(row + 1, col);
        }
        break;

      case 'LEFT':
        if (col - 1 < 0) break;

        nextCell = this.maze[row][col - 1];

        // remove walls between cells
        if (!nextCell.explored) {
          currentCell.walls['LEFT'] = false;
          nextCell.walls['RIGHT'] = false;

          this.dfs(row, col - 1);
        }
        break;
    }
  }
};

Maze.prototype.getRandomOrder = function() {
  return _.shuffle([0, 1, 2, 3]);
};

Maze.prototype.setPlayerPosition = function(row, col) {
  this.playerRowPos = row;
  this.playerColPos = col;
};

Maze.prototype.render = function() {
  var maze = $('<table class="maze"></table>');

  for (var i = 0; i < this.mazeSize; ++i) {
    var row = $('<tr></tr>');

    for (var j = 0; j < this.mazeSize; ++j) {
      var cell  = $('<td></td>');

      _.each(this.maze.maze[i][j].walls, function(val, key) {
        if (val) {
          cell.addClass(key.toLowerCase());
        }
      });

      if (this.playerRowPos === i && this.playerColPos === j) {
        cell.addClass('player');
      }

      row.append(cell);
    }

    maze.append(row);
  }

  return maze;
};

Maze.prototype.movePlayerTop = function() {
  if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['TOP'] === false) {
    this.setPlayerPosition(this.playerRowPos - 1, this.playerColPos);
  }
};

Maze.prototype.movePlayerRight = function() {
  if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['RIGHT'] === false) {
    this.setPlayerPosition(this.playerRowPos, this.playerColPos + 1);
  }
};

Maze.prototype.movePlayerBottom = function() {
  if (this.maze.maze[this.playerRowPos][this.playerColPos].walls['BOTTOM'] === false) {
    this.setPlayerPosition(this.playerRowPos + 1, this.playerColPos);
  }
};

Maze.prototype.movePlayerLeft = function() {
  if (this.maze[this.playerRowPos][this.playerColPos].walls['LEFT'] === false) {
    this.setPlayerPosition(this.playerRowPos, this.playerColPos - 1);
  }
};
