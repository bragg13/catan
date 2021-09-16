class Manager {
  constructor(players) {
      this.round = 0;
      this.players = players;
      this.roundPlayer = "";
      this.dice = 0;
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
