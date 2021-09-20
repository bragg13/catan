var Hexagon = require('./hexagon.js');

class Board {
    constructor(){
        this.board = [];
        this.hex_size = 50;
        this.map_radius = 2;
        this.origin;
        this.padding = 0;
        this.epsilon = this.padding + 1;
        this.intersections = [];
    }

    // ========= SERVER SIDE ========= //
    generateBoard(resourceTypes, values) {
      // available resources: shuffle to make each game different
      this.shuffleArray(resourceTypes);
      this.shuffleArray(values); // no need to shuffle
        
      for (let i = 0; i < 19; i++) {
        let value = (resourceTypes[i] == "bandits") ? 7 : values[i];
        let hex = new Hexagon(i, resourceTypes[i], value);

        this.board.push(hex);
      }
    }

    shuffleArray (array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }
}

module.exports = Board;
