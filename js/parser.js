const operators = new Set(['plus', 'minus', 'times', 'divide', 'exponentiate', 'negate', 'unaryplus']);

const prec = {
  'plus': 2,
  'minus': 2,
  'times': 3,
  'divide': 3,
  'negate': 4,
  'unaryplus': 4,
  'exponentiate': 5,
};

const assoc = {
  'plus': 'left',
  'minus': 'left',
  'times': 'left',
  'divide': 'left',
  'negate': 'left',
  'unaryplus': 'left',
  'exponentiate': 'right',
};

const numOperands = {
  'negate': 1,
  'unaryplus': 1,
  'plus': 2,
  'minus': 2,
  'times': 2,
  'divide': 2,
  'exponentiate': 2,
  'literal': 0,
}

function isSubExpressionStart(token) {
  return !token || operators.has(token.type) || token.type === 'lparen';
}

function preprocess(tokens) {
  let previousToken;
  return tokens.map((token) => {
    const startNewSubExpression = isSubExpressionStart(previousToken);
    if (token.type === 'minus' && startNewSubExpression) {
      token.type = 'negate';
    } else if (token.type === 'plus' && startNewSubExpression) {
      token.type = 'unaryplus';
    }
    previousToken = token;
    return token;
  });
}

function processPreceedingOperators(token, operatorStack, outputStack) {
  while (operatorStack.length
    && ((token.associativity() === 'left' && token.precedence() <= operatorStack.top().precedence())
      || (token.associativity() === 'right' && token.precedence() < operatorStack.top().precedence()))
    && !(numOperands[token.type] === 1 && numOperands[operatorStack.top().type] !== 1)) {
    outputStack.makeASTNode(operatorStack.pop());
  }
}

function processUntilParenBalance(operatorStack, outputStack) {
  while (operatorStack.length && operatorStack.top().type !== 'lparen') {
    outputStack.makeASTNode(operatorStack.pop());
  }
  if (operatorStack.length && operatorStack.top().type === 'lparen') {
    operatorStack.pop();
  }
}

function parse(tokens) {
  tokens = preprocess(tokens);
  const outputStack = [];
  outputStack.makeASTNode = function (token) {
    const numberOfChildren = numOperands[token.type];
    const children = this.splice(this.length - numberOfChildren, numberOfChildren);
    this.push(new ASTNode(token, children));
  };
  const operatorStack = [];
  Token.prototype.precedence = function () {
    return prec[this.type];
  };
  Token.prototype.associativity = function () { return assoc[this.type]; };
  Token.prototype.numberOfOperands = function () {
    return numOperands[this.type];
  };
  operatorStack.top = () => operatorStack[operatorStack.length - 1];
  tokens.forEach((token) => {
    if (token.type === 'literal') {
      outputStack.push(new ASTNode(token));
    } else if (token.type === 'lparen') {
      operatorStack.push(token);
    } else if (token.type === 'rparen') {
      processUntilParenBalance(operatorStack, outputStack);
    } else if (operators.has(token.type)) {
      processPreceedingOperators(token, operatorStack, outputStack);
      operatorStack.push(token);
    }
  });
  while (operatorStack.length) {
    outputStack.makeASTNode(operatorStack.pop());
  }
  return outputStack.pop();
}
