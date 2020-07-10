class Pipe {
  constructor(upImage, downImage) {
    this.upImage = upImage;
    this.downImage = downImage;

    this.top = random(130, (height / 2) - 50);
    this.bottom = random(130, (height / 2) - 50);
    this.x = width;
    this.width = 60;
    this.speed = 2.5;
  }

  hits(birds) {
    let result;

    for (let i = birds.length - 1; i >= 0; i--) {
      let bird = birds[i];

      let hitsTop = collideRectRect(bird.position.x, bird.position.y, bird.width, bird.height,
        this.x, 0, this.width, this.top);
      let hitsBottom = collideRectRect(bird.position.x, bird.position.y, bird.width, bird.height,
        this.x, height - this.bottom, this.width, this.bottom);

      if (hitsTop || hitsBottom) {
        bird.dead = true;
        result = true;
        break;
      } else {
        result = false;
      }

      return result;
    }
  }

  draw() {
    fill(106, 191, 63);
    //rect(this.x, 0, this.width, this.top);
    image(this.downImage, this.x, this.downImage.height / 2 - height / 2 + this.top - this.downImage.height / 2 - 20);
    //rect(this.x, height - this.bottom, this.width, this.bottom);
    image(this.upImage, this.x, height - this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    if (this.x < -this.width) {
      return true;
    } else {
      return false;
    }
  }
}