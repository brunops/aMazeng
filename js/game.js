function Game() {
  this.init();
}

Game.prototype.init = function() {
  this.mazeSize = 20;
  this.maze = new Maze(this.mazeSize);

  this.setPlayerPosition(0, 0);
  this.bindEvents();
  this.render();

  this.keyCodes = {
    top:    38,
    right:  39,
    bottom: 40,
    left:   37
  };
};

Game.prototype.setPlayerPosition = function(row, col) {
  this.playerRowPos = row;
  this.playerColPos = col;
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

  $('body').append(maze);
};
