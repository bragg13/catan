/**
 * Hexagon - Client Side
 */
class Hexagon {

  /**
   * Copy-constructor which takes in input an Hexagon Server Side object
   * @param {Hexagon} _hexagon 
   */
  constructor(_hexagon) {
    this.id = _hexagon.id;
    this.type = _hexagon.type;
    this.value = _hexagon.value;

    // vertices are undefined in the beginning - are they? TODO
    if (_hexagon.vertices === undefined || _hexagon.vertices === null)
      this.vertices = null;
    else 
      this.vertices = [..._hexagon.vertices];

    this.centroid = _hexagon.centroid;
    this.color = _hexagon.color;
    
  }

  // draw() {
  //   this.sprite.draw();
  // }

  /**
   * Function called when Board gets instatied the first time.
   * - set the centroid of the shape
   * - create the actual sprite
   * - setup the sprite attributes, copying objects'
   * - setup the sprite functions
   */
  setupDrawing() {
    // set the centroid of the shape
    this.setCentroid();

    // create the actual sprite and setup the sprite attributes
    this.sprite = createSprite();
    this.sprite.shapeColor = this.color;
    this.sprite.vertices = [...this.vertices];
    this.sprite.centroid = this.centroid;
    this.sprite.value = this.value;

    // on mouse click handler
    this.sprite.onMousePressed = () => {
      console.log(`[click] hexagon: ${this}`);
    }

    // on mouse hover handler
    this.sprite.onMouseOver = () => {
      console.log(this);
      this.shapeColor = 'black';
    }
    this.sprite.onMouseOut = () => {
      this.shapeColor = this.color;
    }

    // the beloved draw function
    this.sprite.draw = function() {

      // brush setup
      stroke('black');
      strokeWeight(0.5);
      fill(this.shapeColor);

      beginShape();
      let i;
    	for(i = 1; i <= 6; i++){
        // draw it
    		point(this.vertices[i % 6].x, this.vertices[i % 6].y);
    		vertex(this.vertices[i % 6].x, this.vertices[i % 6].y);
    		line(this.vertices[i-1].x, this.vertices[i-1].y, this.vertices[i % 6].x, this.vertices[i % 6].y);
    	}
    	endShape();

      // draw text inside hex
      fill( (this.shapeColor=="#fdf5e6" || this.shapeColor=="#f0e68c") ? 0 : 255 );
      textSize(15);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(this.value, this.centroid.x + 1, this.centroid.y + 2)

    }

  }

  /**
   * Function to set the centroid given the vertices. Gonna call this
   * after setting the vertices in the draw function in Board. TODO pass
   * the vertices as parameters. Also calls craftSprite() in the end because
   * yeah
   */
  setCentroid () {
    let vertices = this.vertices;
    let centroid = createVector(0, 0);
    let signedArea = 0;
    let x0 = 0; // Current vertex X
    let y0 = 0; // Current vertex Y
    let x1 = 0; // Next vertex X
    let y1 = 0; // Next vertex Y
    let a = 0;  // Partial signed area
    let vertexCount = vertices.length;

    let lastdex = vertexCount-1;
    let prev = vertices[lastdex];
    let next;

    // For all vertices in a loop
    for (let i=0; i<vertexCount; ++i) {
      next = vertices[i];
      x0 = prev.x;
      y0 = prev.y;
      x1 = next.x;
      y1 = next.y;
      a = x0*y1 - x1*y0;
      signedArea += a;
      centroid.x += (x0 + x1)*a;
      centroid.y += (y0 + y1)*a;
      prev = next;
    }

    signedArea *= 0.5;
    centroid.x /= (6.0*signedArea);
    centroid.y /= (6.0*signedArea);

    this.centroid = centroid;
  }

}
