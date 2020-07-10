let activeItems = [];
let allItems = [];
let numberOfItems = 10;
let pipes = [];
let stars = [];

let generation = 1;

// Images
let birdImg, downPipeImg, upPipeImg, cityImg, starImg;
// Preloading the images
function preload() {
  birdImg = loadImage("img/bird.png");
  upPipeImg = loadImage("img/pipe-up.png");
  downPipeImg = loadImage("img/pipe-down.png");
  cityImg = loadImage("img/city.png");
  starImg = loadImage("img/star.png");
}

function setup() {
  createCanvas(600, 600);

  for (let i = 0; i < numberOfItems; i++) {
    let bird = new Bird();
    bird.setImage(birdImg);
    activeItems.push(bird);
    allItems.push(bird);
  }

  pipes.push(new Pipe(upPipeImg, downPipeImg));
  stars.push(new Star(starImg));
}

function draw() {
  background(78, 192, 202);
  image(cityImg, 0, height - cityImg.height);

  if (frameCount < 200) {
    drawTitle();
  }

  for (let i = stars.length - 1; i >= 0; i--) {
    let star = stars[i];

    star.draw();
    star.update();

    if (star.hitsBird(activeItems)) {
      stars.splice(i, 1);
    }

    if (star.offscreen()) {
      stars.splice(i, 1);
    }
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    let pipe = pipes[i];

    pipe.draw();
    pipe.update();

    if (pipe.offscreen()) {
      pipes.splice(i, 1);
    }
  }

  for (let i = activeItems.length - 1; i >= 0; i--) {
    let bird = activeItems[i];

    if (bird.offscreen()) {
      activeItems.splice(i, 1);
    }

    bird.hitsPipe(pipes);
    bird.think(pipes, stars);
    bird.update();
    bird.draw();
  }

  if (activeItems.length == 0) {
    nextGeneration();
  }

  if (frameCount % 100 == 0) {
    pipes.push(new Pipe(upPipeImg, downPipeImg));
  }

  if (frameCount % 80 == 0) {
    stars.push(new Star(starImg));
  }

  drawScore();
}

function drawTitle() {
  stroke(85, 55, 70);
  strokeWeight(6);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textFont("Courier New", 42);
  fill(254, 183, 70);
  text("Neural", 200, 270);
  fill(223, 216, 154);
  strokeWeight(8);
  textFont("Verdana", 52);
  text("Flappy Bird", 200, 320);
  strokeWeight(1);
  stroke(20);
}

function drawScore() {
  fill(138, 179, 126);
  noStroke();
  rect(400, 0, width, height);
  stroke(50);
  line(400, 0, 400, height);

  fill(30);
  textStyle(NORMAL);
  textFont("Verdana", 18);
  textAlign(LEFT, CENTER);
  text("Generation: " + generation, 410, 25);

  let gap = 48;
  for (let i = 0; i < activeItems.length; i++) {
    let bird = activeItems[i];

    bird.drawScoreBoard(400, gap);
    gap += 55;
  }

  stroke(20);
}

function nextGeneration() {
  generation++;
  normalizeFitness(allItems);
  activeItems = generate(allItems);

  for (let i = activeItems.length - 1; i >= 0; i--) {
    let bird = activeItems[i];
    bird.setImage(birdImg);
  }

  allItems = activeItems.slice();

  pipes = [];
  pipes.push(new Pipe(upPipeImg, downPipeImg));
  stars = [];
  stars.push(new Star(starImg));
}