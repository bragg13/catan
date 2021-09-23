class Intersection {
  constructor(coords){
    this.x = coords.x;
    this.y = coords.y;
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
      ellipse(0, 0, 15, 15);
    }

  }
}
