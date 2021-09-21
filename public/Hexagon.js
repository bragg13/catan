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

    // vertices are undefined in the beginning
    if (_hexagon.vertices === undefined || _hexagon.vertices === null)
      this.vertices = null;
    else 
      this.vertices = [..._hexagon.vertices];

    this.centroid = _hexagon.centroid;
    this.color = _hexagon.color;
    
  }


  /**
   * Function to craft the sprite based on centroid and color.
   * Sets up handler for mouse.
   */
  craftSprite() {
    this.sprite = createSprite(this.centroid.x, this.centroid.y, 50, 50);
    this.sprite.shapeColor = "rgba(0, 0, 0, 0)";
    this.sprite.onMousePressed = () => {
      console.log(`[click] hexagon: ${this}`);
    }
    this.sprite.onMouseOver = () => {
      this.sprite.shapeColor = 
    }
  }


  /**
   * Function to get the centroid given the vertices. Gonna call this
   * after setting the vertices in the draw function in Board. TODO pass
   * the vertices as parameters. Also calls craftSprite() in the end because
   * yeah
   */
  getCentroid () {
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
    this.craftSprite();
  }

}
