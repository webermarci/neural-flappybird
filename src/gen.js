function generate(items) {
  const newItems = [];

  for (var i = 0; i < items.length; i++) {
    const item = poolSelection(items);
    newItems[i] = item;
  }

  return newItems;
}

function normalizeFitness(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].score = pow(items[i].score, 2);
  }

  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].score;
  }

  for (let i = 0; i < items.length; i++) {
    items[i].fitness = items[i].score / sum;
  }
}

function poolSelection(items) {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r -= items[index].fitness;
    index += 1;
  }
  index -= 1;

  return items[index].copy();
}