/**
 * Hexagon - Server Side
 */
class Hexagon {
  constructor(id, type="wood", value=2) {
    this.id = id;
    this.type = type;
    this.value = value;
    
    this.vertices = [];
    this.color = this.getColor(this.type)[0];
    this.highlightColor = this.getColor(this.type)[1];

    this.centroid = null;   // get you later
    this.sprite = null;     // get you later
  }
  
  getColor (type) {
    let resourcecolorMap = {
      "sheep": ["#fdf5e6", "#ebe5da"],
      "wood": ["darkgreen", "#118511"],
      "wheat": ["#f0e68c", "#dbd27f"],
      "clay": ["#ff5722", "#f5673b"],
      "rock": ["darkgrey", "#b8b8b8"],
      "bandits": ["#8b0000", "#ad0202"]
    };
    return resourcecolorMap[type];
  }

}

module.exports = Hexagon;
