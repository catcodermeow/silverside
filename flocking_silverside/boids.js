
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function(render) {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids, render);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y, color, path) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, 0);
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.max_path_force = 0.1;

  this.starting_position = createVector(x, y);

  this.rotation = this.velocity.heading() + radians(180);

  this.transition = false;

  this.counter = 0.0;

  this.color = random([0, 1, 2, 2, 2, 2, 2, 3]);

  this.realCol = color;

  this.size = random([.5, .2, .4, .8, 1]);// random([1.2, .6, .4, 1, 1]);

  this.path = path;


  this.swim_cycle = 0;
}

Boid.prototype.run = function(boids, render) {
  if (render) {
    this.applyBehaviors(boids, this.path);
    this.update();
  //  // this.borders();

   this.rotation = this.velocity.heading() + radians(180);

   this.render();
  } else {
    // this.arrive(this.starting_position);
    // this.rotation = lerp(this.rotation, radians(180), 0.02);
    this.flock(boids);
    this.rotation = this.velocity.heading() + radians(180);

    this.update();
    this.borders();
    this.render();
  } 
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion

  let sek = this.seek(targetPosition);
  // Arbitrarily weight these forces
  sep.mult(2.0);
  ali.mult(1.0);
  coh.mult(1.2);
  sek.mult(targetSeek);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  this.applyForce(sek);
}

// A function to deal with path following and separation
Boid.prototype.applyBehaviors = function(vehicles, path) {
  // Follow path force
  let f = this.follow(path);
   let ali = this.align(vehicles);  
  // // Separate from other boids force
   let s = this.separate(vehicles);

  // Arbitrary weighting
  f.mult(8); // 5
   s.mult(2); // 2
   ali.mult(1); // .5
  // Accumulate in acceleration
  this.applyForce(f);
  this.applyForce(s);
  // this.applyForce(ali);
   this.applyForce(ali);
   //this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

// This function implements Craig Reynolds' path following algorithm
  // http://www.red3d.com/cwr/steer/PathFollow.html
Boid.prototype.follow = function(path) {
    // Predict position 25 (arbitrary choice) frames ahead
    let predict = this.velocity.copy();
    predict.normalize();
    predict.mult(10);
    let predictpos = p5.Vector.add(this.position, predict);

    // Now we must find the normal to the path from the predicted position
    // We look at the normal for each line segment and pick out the closest one
    let normal = null;
    let target = null;
    let worldRecord = 1000000; // Start with a very high worldRecord distance that can easily be beaten

    // Loop through all points of the path
    for (let i = 0; i < path.points.length; i++) {
      // Look at a line segment
      let a = path.points[i];
      let b = path.points[(i + 1) % path.points.length]; // Note Path has to wraparound

      // Get the normal point to that line
      let normalPoint = getNormalPoint(predictpos, a, b);

      // Check if normal is on line segment
      let dir = p5.Vector.sub(b, a);
      // If it's not within the line segment, consider the normal to just be the end of the line segment (point b)
      //if (da + db > line.mag()+1) {
      if (
        normalPoint.x < min(a.x, b.x) ||
        normalPoint.x > max(a.x, b.x) ||
        normalPoint.y < min(a.y, b.y) ||
        normalPoint.y > max(a.y, b.y)
      ) {
        normalPoint = b.copy();
        // If we're at the end we really want the next line segment for looking ahead
        a = path.points[(i + 1) % path.points.length];
        b = path.points[(i + 2) % path.points.length]; // Path wraps around
        dir = p5.Vector.sub(b, a);
      }

      // How far away are we from the path?
      let d = p5.Vector.dist(predictpos, normalPoint);
      // Did we beat the worldRecord and find the closest line segment?
      if (d < worldRecord) {
        worldRecord = d;
        normal = normalPoint;

        // Look at the direction of the line segment so we can seek a little bit ahead of the normal
        dir.normalize();
        // This is an oversimplification
        // Should be based on distance to path & velocity
        dir.mult(10); // 25 normally
        target = normal.copy();
        target.add(dir);
      }
    }

    // // Draw the debugging stuff
    // if (debug) {
    //   // Draw predicted future position
    //   stroke(0);
    //   fill(0);
    //   line(this.position.x, this.position.y, predictpos.x, predictpos.y);
    //   ellipse(predictpos.x, predictpos.y, 4, 4);

    //   // Draw normal position
    //   stroke(0);
    //   fill(0);
    //   ellipse(normal.x, normal.y, 4, 4);
    //   // Draw actual target (red if steering towards it)
    //   line(predictpos.x, predictpos.y, target.x, target.y);
    //   if (worldRecord > path.radius) fill(255, 0, 0);
    //   noStroke();
    //   ellipse(target.x, target.y, 8, 8);
    // }

    // Only if the distance is greater than the path's radius do we bother to steer
    if (worldRecord > path.radius) {
      return this.seek(target);
    } else {
      return createVector(0, 0);
    }
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
 // let theta = this.velocity.heading() + radians(180);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x + 10, this.position.y + 10);
  rotate(this.rotation);
  if (color_fish) {
    image(fish_imgs[this.color], 0, 0, 20 * this.size, 4 * this.size);
  } else {
    image(fish_swim[this.swim_cycle], 0, 0, 20 * this.size, 20 * this.size);
    if (frameCount % 8 == 0) {
      this.swim_cycle = (this.swim_cycle + 1) % 7;
    }
  }
  // noStroke ();
  // fill(getColor(this.position.x, this.position.y));
  // ellipse(0, 0, 20, 4);
//   beginShape();
//   vertex(0, -this.r * 2);
//   vertex(-this.r, this.r * 2);
//   vertex(this.r, this.r * 2);
//   endShape(CLOSE);
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
Boid.prototype.arrive = function(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    let d = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (d < 100) {
      let m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    this.applyForce(steer);
}


// A function to get the normal point from a point (p) to a line segment (a-b)
// This function could be optimized to make fewer new Vector objects
function getNormalPoint(p, a, b) {
  // Vector from a to p
  let ap = p5.Vector.sub(p, a);
  // Vector from a to b
  let ab = p5.Vector.sub(b, a);
  ab.normalize(); // Normalize the line
  // Project vector "diff" onto line by using the dot product
  ab.mult(ap.dot(ab));
  let normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}