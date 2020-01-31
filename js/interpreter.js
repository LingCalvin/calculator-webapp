function plus(a, b) {
  return a + b;
}

function minus(a, b) {
  return a - b;
}

function times(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function exponentiate(a, b) {
  return a ** b;
}

function negate(a) {
  return -1 * a;
}

function unaryplus(a) {
  return a;
}

function interpret(astNode) {
  if (astNode.token.type === 'literal') {
    return astNode.token.value;
  }
  const fn = window[astNode.token.type];
  return fn(...astNode.children.map(interpret));
}
