// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM

// let alignSlider = 1.5;
// let cohesionSlider = 1;
// let separationSlider = 2;

var capturer = new CCapture({
    format: 'png',
    framerate: 30,
  });
let canvas;
let capture = false;

let alter = false;
let index;


let img;
let gif;
let fish_swim = [];

let paths = [];

let debug = true;

let targetSeek = 0.0;

let fish_imgs = [];

let flocks = [];

let background_img;

let render = false; // set to true to start animation

let targetPosition;

let color_fish = false;

let S;
let show_s = false;

function preload() {
    img = loadImage('flocking_silverside/assets/fish.png');
    S = loadImage('flocking_silverside/s.png');
    for (let i = 1; i < 5; i++) {
        fish_imgs.push(loadImage('flocking_silverside/assets/fish' + i + '.png'));
    }
    background_img = loadImage('flocking_silverside/silverside3.png');

    gif = loadImage('flocking_silverside/fish_swimming.gif');
    for (let i = 1; i < 8; i++) {
      fish_swim.push(loadImage('flocking_silverside/white_fish_swim/white_fish' + i + '.png'));
  }
}

let flock;

function setup() {
  canvas = createCanvas(1280, 720);

  flock = new Flock();
  // Add an initial set of boids into the system

  paths.push(new Path());

  flocks.push(new Flock());

  for (let i = 0; i < S_points.length; i++) {
    paths[0].addPoint(S_points[i][0], S_points[i][1]);
  }
  paths[0].radius = 10;

  for (let i = 0; i < 250; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[0]);
    flock.addBoid(b);
    flocks[0].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < I_points.length; i++) {
    paths[1].addPoint(I_points[i][0], I_points[i][1]);
  }

  for (let i = 0; i < 100; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[1]);
    flock.addBoid(b);
    flocks[1].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < L_points.length; i++) {
    paths[2].addPoint(L_points[i][0], L_points[i][1]);
  }

  for (let i = 0; i < 100; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[2]);
    flock.addBoid(b);
    flocks[2].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < V_points.length; i++) {
    paths[3].addPoint(V_points[i][0], V_points[i][1]);
  }

  for (let i = 0; i < 200; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[3]);
    flock.addBoid(b);
    flocks[3].addBoid(b);
  }


  paths.push(new Path());

  flocks.push(new Flock());

  for (let i = 0; i < E_points.length; i++) {
    paths[4].addPoint(E_points[i][0], E_points[i][1]);
  }

  paths[4].radius = 10;

  for (let i = 0; i < 500; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[4]);
    // b.size = random(.5, 1.5);
    flock.addBoid(b);
    flocks[4].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < R_points.length; i++) {
    paths[5].addPoint(R_points[i][0], R_points[i][1]);
  }

  for (let i = 0; i < 75; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[5]);
    b.size = random(.5, .8);
    flock.addBoid(b);
    flocks[5].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < R2_points.length; i++) {
    paths[6].addPoint(R2_points[i][0], R2_points[i][1]);
  }

  for (let i = 0; i < 25; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[6]);
    b.size = random(.5, .8);
    flock.addBoid(b);
    flocks[6].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < R3_points.length; i++) {
    paths[7].addPoint(R3_points[i][0], R3_points[i][1]);
  }

  for (let i = 0; i < 25; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[7]);
    b.size = random(.5, .8);
    flock.addBoid(b);
    flocks[7].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < R4_points.length; i++) {
    paths[8].addPoint(R4_points[i][0], R4_points[i][1]);
  }

  for (let i = 0; i < 25; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[8]);
    b.size = random(.5, .8);
    flock.addBoid(b);
    flocks[8].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < S2_points.length; i++) {
    paths[9].addPoint(S2_points[i][0], S2_points[i][1]);
  }

  for (let i = 0; i < 150; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[9]);
    flock.addBoid(b);
    flocks[9].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < I2_points.length; i++) {
    paths[10].addPoint(I2_points[i][0], I2_points[i][1]);
  }

  for (let i = 0; i < 100; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[10]);
    flock.addBoid(b);
    flocks[10].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < D_points.length; i++) {
    paths[11].addPoint(D_points[i][0], D_points[i][1]);
  }

  for (let i = 0; i < 200; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[11]);
    flock.addBoid(b);
    flocks[11].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < D2_points.length; i++) {
    paths[12].addPoint(D2_points[i][0], D2_points[i][1]);
  }

  for (let i = 0; i < 200; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[12]);
    flock.addBoid(b);
    flocks[12].addBoid(b);
  }

  paths.push(new Path());
  flocks.push(new Flock());

  for (let i = 0; i < E2_points.length; i++) {
    paths[13].addPoint(E2_points[i][0], E2_points[i][1]);
  }

  for (let i = 0; i < 200; i++) {
    let b = new Boid(random(width), random(height), color = [255, 255, 255], paths[13]);
    flock.addBoid(b);
    flocks[13].addBoid(b);
  }

  // for (let i = 0; i < V_points.length; i++) {
  //   path.addPoint(V_points[i][0], V_points[i][1]);
  // }

  // for (let i = 0; i < E_points.length; i++) {
  //    path.addPoint(E_points[i][0], E_points[i][1]);
  //  }

  //  for (let i = 0; i < R_points.length; i++) {
  //    path.addPoint(R_points[i][0], R_points[i][1]);
  //  }

  // background_img.loadPixels();
  // for (let x = 0; x < width; x += 25) {
  //   for (let y = 0; y < height; y += 25) {
  //       let index = (x + y * width) * 4;
  //       let red = background_img.pixels[index];
  //       let green = background_img.pixels[index + 1];
  //       let blue = background_img.pixels[index + 2];
  //       // console.log(red, green, blue);
  //       if (red + green + blue < 750) { // 750 for portraits 
  //           let b = new Boid(x,y, color = [red, green, blue]);
  //           flock.addBoid(b);
  //       }
  //   }
  // }
}

function draw() {
  background(0, 10);
  targetPosition = createVector(mouseX, mouseY);

  if (show_s) {
    image(background_img, 0, 0);
  }

  // if (debug) {
  //   path.display();
  // }

  if (frameCount == 1 && capture) {
      capturer.start();
  }
  // flock.run(render);
  for (let i = 0; i < flocks.length; i++) {
    flocks[i].run(render);
  }

  if (capture) {
      capturer.capture(canvas.elt);
  }

}

function getColor(x, y) {
    let c = background_img.get(x, y);
    return c;
}

function keyPressed() {
  if (key == "s" && capture) {
      capturer.stop();
      capturer.save();
  }

  if (key == "e") {
    let path_points = [];
    for (let p of path.points) {
      path_points.push([p.x, p.y]);
    }
    console.log(path_points);
  }

  if (key == " ") {
    show_s = !show_s;
  }

  if (key == "d") {
    debug = !debug;
  }

  if (key == "r") {

      render = !render;
      for (let i = 0; i < flock.boids.length; i++) {
        flock.boids[i].counter = 0.0;
        flock.boids[i].transition = true;
        console.log(flock.boids[i].transition);
       // flock.boids[i].velocity = createVector(random(-1, 1), random(-1, 1));
      }
  }
}

// // Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}

function newPath() {
  // A path is a series of connected points
  // A more sophisticated path might be a curve
  path = new Path();
  // let offset = 30;
  // path.addPoint(offset, offset);
  // path.addPoint(width - offset, offset);
  // path.addPoint(width - offset, height - offset);
  // path.addPoint(width / 2, height - offset * 3);
  // path.addPoint(offset, height - offset);
}

function mousePressed() {
  for (let p of path.points) {
    if (mouseX > p.x - 10 && mouseX < p.x + 10 && mouseY > p.y - 10 && mouseY < p.y + 10) {
      index = path.points.indexOf(p);
      alter = true;
    }
  }

  if (!alter) {
    path.addPoint(mouseX, mouseY);
  } else {
    path.alterPoint(mouseX, mouseY, index);
    alter = false;
  }

}