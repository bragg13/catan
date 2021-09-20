class Board {
    constructor(_board){
        this.board = _board.board.map(hex => new Hexagon(hex));    // basically an array of hexagons. gotta cast 
        this.hex_size = _board.hex_size;
        this.map_radius = _board.map_radius;
        this.origin = _board.origin;
        this.padding = _board.padding;
        this.epsilon = _board.epsilon;
        this.intersections = _board.intersections;      // TODO as far for now i have vertices for each hexagon, but i dont have intersections (streets)
    }


    init () {
      // generate board
      let tmpBoard = [...this.board]; // copy

      angleMode(RADIANS);
      origin = createVector(width/2, height/2);

      // drawing map
      for (let q = -this.map_radius; q <= this.map_radius; q++) {
          var r1 = max(-this.map_radius, -q - this.map_radius);
          var r2 = min(this.map_radius, -q + this.map_radius);
          for (var r = r1; r <= r2; r++) {
            // get color from board, along withthe value
            let hex = tmpBoard.pop();
            this.draw_hexagon(this.hex_to_pixel(q, r), this.hex_size, q, r, hex);
          }
      }

      // intersections
      strokeWeight(10);
      for(var i = 0; i < this.intersections.length; i++){
          this.intersections[i].id = i;
          //point(this.intersections[i].x, this.intersections[i].y);
      }
    }

    draw_hexagon(center, size, q, r, hex, drawCities = true){
    	var points = [];

      // finding out the vertices
    	for(var i = 0; i < 6; i++){
    		points.push(this.hex_corner(center, size - this.padding, i));

        // this vertex
        var c = this.hex_corner(center, size, i);
        if(this.intersections_includes(c) == false && drawCities){

          // create the intersection
          c.sprite = createSprite(c.x, c.y, 15, 15);  // sprite
          c.sprite.shapeColor = 'black';              // sprite color
          c.sprite.onMousePressed = () => {           // click handler
            console.log(c.id);
          }

          this.intersections.push(c);
        }

    	}

      // draw actual hex
    	beginShape();
    	for(i = 1; i <= 6; i++){
        // dye the hex
        fill(hex.color);

        // draw it
    		point(points[i % 6].x, points[i % 6].y);
    		vertex(points[i % 6].x, points[i % 6].y);
    		line(points[i-1].x, points[i-1].y, points[i % 6].x, points[i % 6].y);
    	}
    	endShape();

      // metto i punti nell'hex e calcolo il centro del hex
      let indice = this.board.findIndex((item) => item.id == hex.id);  // trovo l'indice dell'elemento nella board cosi da averne una ref per modificarlo
      this.board[indice].vertices = points;
      this.board[indice].getCentroid();

      // draw text inside hex
    	fill( (hex.color=="#fdf5e6" || hex.color=="#f0e68c") ? 0 : 255 );
    	textSize(15);
      textStyle(BOLD);
    	textAlign(CENTER, CENTER);
    	text(hex.value, center.x + 1, center.y + 2)
    }


    /* === UTILS FUNCTIONS ===*/
    pixel_to_hex(x, y){
      q= (x*sqrt(3)/3-y/3)/this.hex_size;
      r=(-x/3+sqrt(3)/3*y)/this.hex_size;
      return createVector(round(q),round(r));
    }

    hex_to_pixel(q, r) {
      // This is basically a matrix multiplication between a hexagon orientation matrix
      // and the vector {q; r}
        var x = (sqrt(3) * q + sqrt(3)/2 * r) * (this.hex_size ) ;
        var y = (0 * q + 3/2 * r) * this.hex_size;
        return createVector(x + origin.x, y + origin.y);
    }

    intersections_includes(c){
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

    hex_corner(center, size, i){
        var angle_deg = 60 * i   + 30
        var angle_rad = PI/180 * angle_deg;
        return createVector(center.x + size * cos(angle_rad),
                     center.y + size * sin(angle_rad));
    }


}
