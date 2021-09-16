class Player {
  constructor(name, id) {
    // basic info
    this.name = name;
    this.id = id;

    // gui
    this.guiX = playerGUIcoords[id].x;
    this.guiY = playerGUIcoords[id].y;

    // cards and pieces
    this.roads = [];
    this.colonies = [];
    this.cities = [];
    this.dev = [];
    this.res = [];
  }
}
