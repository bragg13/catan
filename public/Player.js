class Player {
  constructor(_player) {
    // basic info
    this.name =_player.name;
    this.socketid =_player.socketid;
    
    // cards and_player cards
    this.roads =_player.roads;
    this.colonies =_player.colonies;
    this.cities =_player.cities;
    this.dev =_player.dev;
    this.resources =_player.resources;

    // prizes
    this.prizes =_player.prizes;
    this.longestRoad =_player.longestRoad;
    this.color = _player.color;

  }

  getPoints () {
    let points = 0;
    points += this.colonies.length;
    points += (this.cities.length * 2);

    points += (this.bestArmy) ? 1 : 0;
    points += (this.longestRoad) ? 1 : 0;
    points += this.dev.filter(card => card.isPoint==true).length;
    
    return points;
  }
}