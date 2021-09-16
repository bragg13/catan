

class Hexagon {

    constructor(id, type="wood", value=2) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.color = resourcecolorMap[this.type];

        this.vertices = [];
        this.centroid = null;
        this.sprite = null;

        // this.sprite = createSprite(x,y,width,height)
        // this.image = loadImage(`res/${this.type}.png`);
        // this.image.resize(100, 100);
    }

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
      return centroid;
    }

    craftSprite() {
      this.sprite = createSprite(this.centroid.x, this.centroid.y, 50, 50);
      this.sprite.shapeColor = "rgba(0, 0, 0, 0)";
      this.sprite.onMousePressed = () => {
        console.log(this);
      }
    }

}
