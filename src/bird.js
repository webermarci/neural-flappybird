class Bird {
  constructor(brain) {
    this.image = null;
    this.width = 28;
    this.height = 24;
    this.color = color(random(0, 255), random(0, 255), random(0, 255));

    this.position = createVector(64, height / 2);
    this.gravity = createVector(0, 6);
    this.lift = createVector(0, 0);
    this.lifting = false;
    this.dead = false;

    this.score = 0;
    this.fitness = 0;
    this.inputs = [];
    this.action = [];

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate();
    } else {
      this.brain = new NeuralNetwork(6, 16, 2);
    }
  }

  copy() {
    return new Bird(this.brain);
  }

  draw() {
    this.score++;
    fill(this.color);
    let velocity = (this.gravity.y + this.lift.y) * 3;

    push();
    translate(this.position.x, this.position.y);
    angleMode(DEGREES);
    rotate(velocity);
    image(this.image, 0, 0);
    pop();
  }

  setImage(image) {
    this.image = image;
  }

  drawScoreBoard(x, y) {
    fill('rgba(100, 100, 100, 0.3)');
    rect(x + 3, y + 3, 194, 50, 3);
    image(this.image, x + 8, y + 17);

    fill(50);
    noStroke();
    for (let i = 0; i < this.inputs.length; i++) {
      rect(x + 60 + (i * 5), y + 29, 4, this.inputs[i] * 15);
    }

    for (let i = 0; i < this.action.length; i++) {
      rect(x + 100 + (i * 5), y + 29, 4, map(this.action[i], 0, 1, -1, 1) * 15);
    }

    textFont("Verdana", 12);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(this.score, x + 130, y + 29);
    stroke(20);
  }

  update() {
    if (this.lifting && this.lift.y > -12) {
      this.lift.y -= 4;
    } else {
      this.lifting = false;
    }

    if (this.dead) {
      this.lift.x = -1.7;
    }

    this.position.add(this.gravity).add(this.lift);
    this.lift.y *= 0.9;
  }

  hitsPipe(pipes) {
    for (let i = pipes.length - 1; i >= 0; i--) {
      let pipe = pipes[i];
      let hitsTop = collideRectRect(this.position.x, this.position.y, this.width, this.height,
        pipe.x, 0, pipe.width, pipe.top);
      let hitsBottom = collideRectRect(this.position.x, this.position.y, this.width, this.height,
        pipe.x, height - pipe.bottom, pipe.width, pipe.bottom);

      if (hitsTop || hitsBottom) {
        this.dead = true;
        break;
      }
    }
  }

  offscreen() {
    return (this.position.y > height || this.position.y < 0 - this.height);
  }

  kill() {
    this.dead = true;
  }

  up(size) {
    if (!this.dead) {
      this.lifting = true;
    }
  }

  think(pipes, stars) {
    let pipe = null;
    let pipeRecord = Infinity;
    let star = null;
    let starRecord = Infinity;

    for (let i = 0; i < pipes.length; i++) {
      let current = pipes[i];
      let dist = current.x - this.position.x;
      if (dist < pipeRecord) {
        pipeRecord = dist;
        pipe = current;
      }
    }

    for (let i = 0; i < stars.length; i++) {
      let current = stars[i];
      let dist = current.position.x - this.position.x;
      if (dist < starRecord) {
        starRecord = dist;
        star = current;
      }
    }

    this.inputs = [];
    this.inputs[0] = map(this.position.y, 0, 600, -1, 1);
    this.inputs[1] = map(this.position.y - pipe.top, 0, 600, -1, 1);
    this.inputs[2] = map(height - pipe.bottom, 0, 600, -1, 1);
    this.inputs[3] = map(pipeRecord, -100, 600, -1, 1);
    this.inputs[4] = map(starRecord, -100, 600, -1, 1);
    this.inputs[5] = map(star.position.y - this.position.y, -300, 300, -1, 1);

    this.action = this.brain.query(this.inputs);
    let actionIndex = maxActionIndex(this.action);

    switch (actionIndex) {
      case 0:
        this.up();
        break;
      case 1:
        break;
    }
  }

  maxActionIndex(action) {
    let max = action[0];
    let index = 0;

    for (let i = 0; i < action.length; i++) {
      let current = action[i];
      if (current >= max) {
        max = current;
        index = i;
      }
    }
    return index;
  }
}