/**
 * Edge - Client Side
 */
 class Edge {

    constructor(v1, v2) {
        this.v1 = v1;
        this.v2 = v2;
        this.id = v1+""+v2;
        this.content = [];
    }
  
    draw () {
        strokeWeight(4);
        stroke('black');
        line(v1.x, v1.y, v2.x, v2.y);
    }
  }
  