// Path Following (Complex Path)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

class Path {
    constructor() {
      // Arbitrary radius of 20
      // A path has a radius, i.e how far is it ok for the boid to wander off
      this.radius = 5;
      // A Path is an arraylist of points (PVector objects)
      this.points = [];
    }
  
    // Add a point to the path
    addPoint(x, y) {
      let point = createVector(x, y);
      this.points.push(point);
    }

    alterPoint(x, y, index) {
        let point = createVector(x, y);
        this.points[index] = point;    
    }
  
    // Draw the path
    display() {
      strokeJoin(ROUND);
  
      // Draw thick line for radius
      stroke(175);
      strokeWeight(10);
      noFill();
      beginShape();
      for (let v of this.points) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
      for (let v of this.points) {
        stroke(255, 0, 0);
        ellipse(v.x, v.y, this.radius, this.radius);
      }
      // Draw thin line for center of path
      stroke(0);
      strokeWeight(1);
      noFill();
      beginShape();
      for (let v of this.points) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
    }
  }
  