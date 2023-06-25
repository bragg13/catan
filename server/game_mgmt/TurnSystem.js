export class TurnSystem {
  constructor(players) {
    this.playerOrder = players.map((el) => el.id);
    this.playerOrderIndex = 0;
    this.player = this.playerOrder[this.playerOrderIndex];

    this.initialTurnSteps = {
      [players[0].id]: 0,
      [players[1].id]: 0,
      // [players[2].id]: 0,
      // [players[3].id]: 0,
    };

    this.round = -1;
  }

  nextTurn = () => {
    console.log("normal turn");
    return {
      isInitialTurn
    }
  };

  nextInitialTurn = () => {
    // di chi è il turno ora
    this.player = this.playerOrder[this.playerOrderIndex];

    // ok
    if (this.initialTurnSteps[this.player] === 4) {
      this.round = 0
      return {
        round: this.round
      }
    }

    let data = {
      round: this.round
    };
    data.player = this.player;

    // cosa puo fare in questo turno
    switch (this.initialTurnSteps[this.player]) {
      case 0:
      case 2:
        data.send = "spots";
        break;

      case 1:
      case 3:
        data.send = "roads";
        break;
    }

    this.initialTurnSteps[this.player]++;

    // controllo se devo passare il turno
    if (this.initialTurnSteps[this.player] === 2) {
      // primo turno di early game - finito
      this.playerOrderIndex++;

      if (this.playerOrderIndex === this.playerOrder.length)
        this.playerOrderIndex = 0;

    } else if (this.initialTurnSteps[this.player] === 4) {
      // secondo turno di early game - finito
      this.playerOrderIndex++;

      if (this.playerOrderIndex === this.playerOrder.length)
        this.playerOrderIndex = 0;
    }

    return data;
  };
}
