const interpreter = {};
interpreter.plus = (a, b) => a + b;

interpreter.minus = (a, b) => a - b;

interpreter.times = (a, b) => a * b;

interpreter.divide = (a, b) => a / b;


interpreter.exponentiate = (a, b) => a ** b;

interpreter.negate = (a) => -1 * a;

interpreter.unaryplus = (a) => a;

function interpret(astNode) {
  if (astNode.token.type === 'literal') {
    return astNode.token.value;
  }
  const fn = interpreter[astNode.token.type];
  return fn(...astNode.children.map(interpret));
}

export { interpret as default };
