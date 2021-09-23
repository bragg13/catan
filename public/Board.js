class Board {
  constructor(_board){
    this.board = _board.board.map(hex => new Hexagon(hex));    // basically an array of hexagons. gotta cast 
    
    // stuff useful for drawing
    this.hex_size = 50;
    this.map_radius = 2;
    this.padding = 0;
    this.epsilon = this.padding + 1;
    this.origin;

    // spots where players could create stuff
    this.intersections = [];
    this.edges = [];                // TODO
  }


  init () {
    // drawing stuff; origin is the center of the canvas
    angleMode(RADIANS);
    origin = createVector(width/2, height/2);

    // drawing map
    let hexIndex = 0;
    for (let q = -this.map_radius; q <= this.map_radius; q++) {
      var r1 = max(-this.map_radius, -q - this.map_radius);
      var r2 = min(this.map_radius, -q + this.map_radius);
      for (var r = r1; r <= r2; r++) {
        this.createHexagon(this.hexToPixel(q, r), hexIndex);     // q&r are coords
        hexIndex++;
      }
    }

    // intersections
    strokeWeight(10);
    for(var i = 0; i < this.intersections.length; i++){
        this.intersections[i].id = i;
        this.intersections[i].setupDrawing();
        //point(this.intersections[i].x, this.intersections[i].y);
    }
  }

  createHexagon(center, hexIndex){
    let vertices = [];
    let size = this.hex_size;

    // finding out the vertices
    for(let i = 0; i < 6; i++){
      // vertices.push(this.hexCorner(center, size - this.padding, i));

      // this vertex
      var c = this.hexCorner(center, size, i);
      vertices.push(c);

      // if vertex isnt already in my list, I'll add it
      if(this.intersectionsIncludes(c) == false){
        let int = new Intersection(c);
        this.intersections.push(int);
      }
    }

    // setting up actual hexagon's vertices and setting it up
    this.board[hexIndex].vertices = [...vertices];
    this.board[hexIndex].setupDrawing();
  }


  /* === UTILS FUNCTIONS ===*/
  pixel_to_hex(x, y){
    q= (x*sqrt(3)/3-y/3)/this.hex_size;
    r=(-x/3+sqrt(3)/3*y)/this.hex_size;
    return createVector(round(q),round(r));
  }

  hexToPixel(q, r) {
    // This is basically a matrix multiplication between a hexagon orientation matrix
    // and the vector {q; r}
      var x = (sqrt(3) * q + sqrt(3)/2 * r) * (this.hex_size ) ;
      var y = (0 * q + 3/2 * r) * this.hex_size;
      return createVector(x + origin.x, y + origin.y);
  }

  intersectionsIncludes(c){
    for(var i = 0; i < this.intersections.length; i++){
      // I have to use approx because the this.padding rsults in the
      // this.intersections not having the EXACT same location (and other things don't line up)
      if(this.approx(this.intersections[i].x,c.x) && this.approx(this.intersections[i].y, c.y)){
        return true;
      }
    }
    return false;
  }


  approx(a,b){
    if(abs(a - b) < this.epsilon)
      return true;
    return false;
  }

  hexCorner(center, size, i){
      var angle_deg = 60 * i   + 30
      var angle_rad = PI/180 * angle_deg;
      return createVector(center.x + size * cos(angle_rad),
                    center.y + size * sin(angle_rad));
  }


}
