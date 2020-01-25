const functionMap = {
  '+': 'addOp',
  '−': 'subtractOp',
  '×': 'multiplyOp',
  '÷': 'divideOp',
  '^': 'exponentiateOp',
};

function addOp(a, b) {
  return a + b;
}

function subtractOp(a, b) {
  return a - b;
}

function multiplyOp(a, b) {
  return a * b;
}

function divideOp(a, b) {
  return a / b;
}

function exponentiateOp(a, b) {
  return a ** b;
}


function interpret(astNode) {
  if (astNode.token.type === 'Literal') {
    return astNode.token.value;
  }
  const fn = window[functionMap[astNode.token.value]];
  return fn(interpret(astNode.leftChild), interpret(astNode.rightChild));
}
