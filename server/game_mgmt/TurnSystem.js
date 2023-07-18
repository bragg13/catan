import { debug } from "../index.js";

export class TurnSystem {
  constructor(players) {
    this.playerOrder = Object.keys(players);
    this.playerOrderIndex = 0;
    this.player = this.playerOrder[this.playerOrderIndex];

    this.action = null;
    this.earlyGameSteps = {
      [this.playerOrder[0]]: (debug) ? 4 : 0,
      [this.playerOrder[1]]: (debug) ? 4 : 0,
      // [players[2].id]: 0,
      // [players[3].id]: 0,
    };

    this.round = -1;
    this.dice = { value1: 1, value2: 1 };
  }

  nextTurn = () => {
    // di chi è il turno ora
    this.player = this.playerOrder[this.playerOrderIndex];

    // turno di early game - finito
    this.playerOrderIndex++;

    if (this.playerOrderIndex === this.playerOrder.length)
      this.playerOrderIndex = 0;

    return this.getTurnData();
  };

  getTurnData = () => {
    return {
      player: this.player,
      action: this.action,
      round: this.round,
      dice: this.dice
    }
  };

  nextInitialTurn = () => {
    // di chi è il turno ora
    this.player = this.playerOrder[this.playerOrderIndex];

    // to handle the GUI
    if (this.earlyGameSteps[this.player] === 5) {
      // starts the game in a way
      this.round = 0
      this.action = 'diceRoll'
      return this.getTurnData();
    }

    // cosa puo fare in questo turno
    switch (this.earlyGameSteps[this.player]) {
      case 0:
        this.action = 'town_1'
        break;

      case 2:
        this.action = 'town_2'
        break;

      case 1:
        this.action = 'road_1'
        break;

      case 3:
        this.action = 'road_2'
        break;

      case 4:
        this.action = 'harvest'
        break;
    }

    this.earlyGameSteps[this.player]++;

    // controllo se devo passare il turno
    if (this.earlyGameSteps[this.player] === 2 || this.earlyGameSteps[this.player] === 4 || this.earlyGameSteps[this.player] === 5) {
      // turno di early game - finito
      this.playerOrderIndex++;

      if (this.playerOrderIndex === this.playerOrder.length)
        this.playerOrderIndex = 0;

    }

    return this.getTurnData();
  };
}
