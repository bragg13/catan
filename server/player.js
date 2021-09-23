class Player {
  constructor(name, socketid, color) {
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
    this.color = color;
  }
}

module.exports = Player;