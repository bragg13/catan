class Intersection {
  constructor(coords){
    this.coords = coords;
    this.x = Math.floor(coords.x);
    this.y = Math.floor(coords.y);

    this.hexagons = []; 
    this.size = 0; // default: 0 | when to be selected: 15
  }
  
  changeSize() {
    this.size = (this.size==5) ? 15 : 0;
  }
  
  setupDrawing() {
    this.sprite = createSprite(this.x, this.y, 15, 15);  // sprite
    this.sprite.shapeColor = 'black';              // sprite color

    // intersection click handler
    this.sprite.onMousePressed = () => {
      console.log(`[click] intersection: ${this}`);
    }
  
    // intersection hover handler
    this.sprite.onMouseOver = () => {
      this.sprite.shapeColor = 'red';
      // this.sprite.scale = 2;
    }

    this.sprite.onMouseOut = () => {
      this.sprite.shapeColor = 'black';
      // this.sprite.scale = 1;
    }

    // redefines draw function - otherwise first shape is a rect
    this.sprite.draw = () => {
      fill(this.sprite.shapeColor);
      ellipse(0, 0, this.size, this.size);
    }

  }
}
