class Player {
  constructor(name, socketid) {
    // basic info
    this.name = name;
    this.socketid = socketid;

    // cards and pieces
    this.roads = [];
    this.colonies = [];
    this.cities = [];
    this.dev = [];

    // debug
    this.resources = [{color: 'red'}, {color: 'green'}, {color: 'yellow'}];

    // prizes
    this.bestArmy = false;
    this.longestRoad = false;

    // points
    this.army = 0;

    // color
    // this.color = ...
  }
}

module.exports = Player;