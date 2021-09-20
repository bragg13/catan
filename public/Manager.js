class Manager {
    constructor(_mgr) {
        this.round = _mgr.round;
        this.players = _mgr.players;
        this.roundPlayer = _mgr.roundPlayer;
        this.dice = _mgr.dice;
    }
  
  
    diceroll = () => {
        return Math.floor(Math.random*13);
  
    }
  
    nextRound = () => {
        // next round
        this.round++;
  
        // whose is it - highlight
        this.roundPlayer = this.players[this.round % this.players.length];
  
        // roll dice
        this.dice = this.diceroll();
  
        // assign resources
  
        // let player make moves
    } 
}