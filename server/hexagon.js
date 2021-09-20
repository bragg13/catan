/**
 * Hexagon - Server Side
 */
class Hexagon {
  constructor(id, type="wood", value=2) {
    this.id = id;
    this.type = type;
    this.value = value;
    
    this.vertices = [];
    this.color = this.getColor(this.type);
    
    this.centroid = null;   // get you later
    this.sprite = null;     // get you later
  }
  
  getColor (type) {
    let resourcecolorMap = {
      "sheep": "#fdf5e6",
      "wood": "darkgreen",
      "wheat": "#f0e68c",
      "clay": "#ff5722",
      "rock": "darkgrey",
      "bandits": "red"
    };

    return resourcecolorMap[type];
  }

}

module.exports = Hexagon;
