class Manager {
    constructor() {
        this.round = 0;
        this.dice = 0;

        this.players = [];
        this.roundPlayer = "";
        this.playersColors = ['red', 'yellow', 'lightblue', 'orange'];
    }
  
  
    diceroll = () => {
        return Math.floor(Math.random*13);
  
    }
  
    nextRound = () => {
        // next round
        this.round++;
  
        // whose is it - highlight
        this.roundPlayer = this.players[this.round % this.players.length];
  
        // assign resources
  
        // let player make moves
    } 

    getResources = () => {

    }


}

module.exports = Manager;