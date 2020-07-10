NeuralNetwork.sigmoid = function (x) {
  let y = 1 / (1 + pow(Math.E, -x));
  return y;
}

NeuralNetwork.dSigmoid = function (x) {
  return x * (1 - x);
}

NeuralNetwork.tanh = function (x) {
  let y = Math.tanh(x);
  return y;
}

NeuralNetwork.dtanh = function (x) {
  let y = 1 / (pow(Math.cosh(x), 2));
  return y;
}

function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function NeuralNetwork(inputnodes, hiddennodes, outputnodes, learning_rate, activation) {
  if (arguments[0] instanceof NeuralNetwork) {
    let nn = arguments[0];
    this.inodes = nn.inodes;
    this.hnodes = nn.hnodes;
    this.onodes = nn.onodes;
    this.wih = nn.wih.copy();
    this.who = nn.who.copy();
    this.activation = nn.activation;
    this.derivative = nn.derivative;
    this.lr = this.lr;
  } else {
    this.inodes = inputnodes;
    this.hnodes = hiddennodes;
    this.onodes = outputnodes;

    this.wih = new Matrix(this.hnodes, this.inodes);
    this.who = new Matrix(this.onodes, this.hnodes);

    this.wih.randomize();
    this.who.randomize();

    this.lr = learning_rate || 0.1;

    // Activation Function
    if (activation == 'tanh') {
      this.activation = NeuralNetwork.tanh;
      this.derivative = NeuralNetwork.dtanh;
    } else {
      this.activation = NeuralNetwork.sigmoid;
      this.derivative = NeuralNetwork.dSigmoid;
    }

  }

}

NeuralNetwork.prototype.copy = function () {
  return new NeuralNetwork(this);
}

NeuralNetwork.prototype.mutate = function () {
  this.wih = Matrix.map(this.wih, mutate);
  this.who = Matrix.map(this.who, mutate);
}

// Train the network with inputs and targets
NeuralNetwork.prototype.train = function (inputs_array, targets_array) {

  // Turn input and target arrays into matrices
  let inputs = Matrix.fromArray(inputs_array);
  let targets = Matrix.fromArray(targets_array);

  let hiddenInputs = Matrix.dot(this.wih, inputs);
  let hiddenOutputs = Matrix.map(hiddenInputs, this.activation);

  let outputInputs = Matrix.dot(this.who, hiddenOutputs);
  let outputs = Matrix.map(outputInputs, this.activation);
  let outputErrors = Matrix.subtract(targets, outputs);

  let whoT = this.who.transpose();
  let hiddenErrors = Matrix.dot(whoT, outputErrors)

  let gradient_output = Matrix.map(outputs, this.derivative);
  gradient_output.multiply(outputErrors);
  gradient_output.multiply(this.lr);

  let gradientHidden = Matrix.map(hiddenOutputs, this.derivative);
  gradientHidden.multiply(hiddenErrors);
  gradientHidden.multiply(this.lr);

  let hiddenOutputsT = hiddenOutputs.transpose();
  let deltaWOutput = Matrix.dot(gradient_output, hiddenOutputsT);
  this.who.add(deltaWOutput);

  let inputsT = inputs.transpose();
  let deltaWHidden = Matrix.dot(gradientHidden, inputsT);
  this.wih.add(deltaWHidden);
}

NeuralNetwork.prototype.query = function (inputs_array) {
  let inputs = Matrix.fromArray(inputs_array);

  let hiddenInputs = Matrix.dot(this.wih, inputs);
  let hiddenOutputs = Matrix.map(hiddenInputs, this.activation);

  let outputInputs = Matrix.dot(this.who, hiddenOutputs);
  let outputs = Matrix.map(outputInputs, this.activation);

  return outputs.toArray();
}

NeuralNetwork.prototype.actionIndex = function (inputs_array) {
  return maxActionIndex(this.query(inputs_array));
}

function maxActionIndex(action) {
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