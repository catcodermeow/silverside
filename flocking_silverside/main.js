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
let capture = true;


let img;

let targetSeek = 0.0;

let fish_imgs = [];

let background_img;

let render = false; // set to true to start animation

let targetPosition;

let color_fish = true;

function preload() {
    img = loadImage('flocking_silverside/assets/fish.png');
    for (let i = 1; i < 5; i++) {
        fish_imgs.push(loadImage('flocking_silverside/assets/fish' + i + '.png'));
    }
    background_img = loadImage('flocking_silverside/silverside3.png');
}

let flock;

function setup() {
  canvas = createCanvas(1280, 720);

  flock = new Flock();
  // Add an initial set of boids into the system
  background_img.loadPixels();
  for (let x = 0; x < width; x += 15) {
    for (let y = 0; y < height; y += 10) {
        let index = (x + y * width) * 4;
        let red = background_img.pixels[index];
        let green = background_img.pixels[index + 1];
        let blue = background_img.pixels[index + 2];
        // console.log(red, green, blue);
        if (red + green + blue < 750) { // 750 for portraits 
            let b = new Boid(x,y, color = [red, green, blue]);
            flock.addBoid(b);
        }
    }
  }
}

function draw() {
  background(0);
  targetPosition = createVector(mouseX, mouseY);

  if (frameCount == 1 && capture) {
      capturer.start();
  }
  flock.run(render);

  if (capture) {
      capturer.capture(canvas.elt);
  }

}

function keyPressed() {
  if (key == "s" && capture) {
      capturer.stop();
      capturer.save();
  }

  if (key == "r") {

      render = !render;
      for (let i = 0; i < flock.boids.length; i++) {
        flock.boids[i].counter = 0.0;
        flock.boids[i].transition = true;
        console.log(flock.boids[i].transition);
        flock.boids[i].velocity = createVector(random(-1, 1), random(-1, 1));
      }
  }
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}