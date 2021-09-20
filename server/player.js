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
    this.res = [];
  }
}

module.exports = Player;