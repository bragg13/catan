var Hexagon = require('./hexagon.js');

class Board {
    constructor(){
        this.board = [];
    }

    /**
     * Board is generated in the server
     * @param {Array} resourceTypes Types and how many resources are there in the game
     * @param {Array} values Values that resources can take
     */
    generateBoard(resourceTypes, values) {
      // available resources: shuffle to make each game different
      this.shuffleArray(resourceTypes);
      this.shuffleArray(values); // no need to shuffle
      
      // creating 19 hexagons with random values and resources
      for (let i = 0; i < 19; i++) {
        let value = (resourceTypes[i] == "bandits") ? 7 : values[i];
        let hex = new Hexagon(i, resourceTypes[i], value);

        this.board.push(hex);
      }
    }

    /**
     * Takes an array and shuffles it 
     * @param {Array} array The array to shuffle
     */
    shuffleArray (array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }
}

module.exports = Board;
