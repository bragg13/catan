class Player {
  constructor(name, id) {
    // basic info
    this.name = name;
    this.id = id;

    // cards and pieces
    this.roads = [];
    this.colonies = [];
    this.cities = [];
    this.dev = [];
    this.res = [];
  }
}