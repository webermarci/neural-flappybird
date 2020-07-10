function Matrix(rows, cols) {
  this.rows = rows;
  this.cols = cols;
  this.matrix = new Array(rows);

  for (let i = 0; i < this.rows; i++) {
    this.matrix[i] = new Array(cols);
    for (let j = 0; j < this.cols; j++) {
      this.matrix[i][j] = 0;
    }
  }
}

Matrix.prototype.randomize = function () {
  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.cols; j++) {
      this.matrix[i][j] = randomGaussian();
    }
  }
}

Matrix.prototype.toArray = function () {
  let arr = [];
  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.cols; j++) {
      arr.push(this.matrix[i][j]);
    }
  }
  return arr;
}

Matrix.prototype.transpose = function () {
  let result = new Matrix(this.cols, this.rows);
  for (let i = 0; i < result.rows; i++) {
    for (let j = 0; j < result.cols; j++) {
      result.matrix[i][j] = this.matrix[j][i];
    }
  }
  return result;
}

Matrix.prototype.copy = function () {
  let result = new Matrix(this.rows, this.cols);
  for (let i = 0; i < result.rows; i++) {
    for (let j = 0; j < result.cols; j++) {
      result.matrix[i][j] = this.matrix[i][j];
    }
  }
  return result;
}

Matrix.prototype.add = function (other) {
  if (other instanceof Matrix) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] += other.matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] += other;
      }
    }
  }
}

Matrix.prototype.multiply = function (other) {
  if (other instanceof Matrix) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] *= other.matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] *= other;
      }
    }
  }
}

Matrix.map = function (m, fn) {
  let result = new Matrix(m.rows, m.cols);
  for (let i = 0; i < result.rows; i++) {
    for (let j = 0; j < result.cols; j++) {
      result.matrix[i][j] = fn(m.matrix[i][j]);
    }
  }
  return result;
}

Matrix.subtract = function (a, b) {
  let result = new Matrix(a.rows, a.cols);
  for (let i = 0; i < result.rows; i++) {
    for (let j = 0; j < result.cols; j++) {
      result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
    }
  }
  return result;
}

Matrix.dot = function (a, b) {
  if (a.cols != b.rows) {
    console.error("Incompatible matrix sizes!");
    return;
  }
  let result = new Matrix(a.rows, b.cols);
  for (let i = 0; i < a.rows; i++) {
    for (let j = 0; j < b.cols; j++) {
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.matrix[i][k] * b.matrix[k][j];
      }
      result.matrix[i][j] = sum;
    }
  }
  return result;
}

Matrix.fromArray = function (array) {
  let m = new Matrix(array.length, 1);
  for (let i = 0; i < array.length; i++) {
    m.matrix[i][0] = array[i];
  }
  return m;
}
