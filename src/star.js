class Star {
  constructor(image) {
    this.image = image;
    this.size = 30;
    this.position = createVector(width, random(150, height - 150));
    this.speed = 2;
  }

  draw() {
    image(this.image, this.position.x, this.position.y, this.size, this.size);
  }

  update() {
    this.position.x -= this.speed;
  }

  hitsBird(birds) {
    let result = false;
    for (let i = birds.length - 1; i >= 0; i--) {
      let bird = birds[i];
      let hits = collideRectRect(this.position.x, this.position.y, this.size, this.size,
        bird.position.x, bird.position.y, bird.width, bird.height);

      if (hits) {
        bird.score += 1000;
        result = true;
        break;
      }
    }
    return result;
  }

  offscreen() {
    if (this.position.x < -this.size) {
      return true;
    } else {
      return false;
    }
  }
}