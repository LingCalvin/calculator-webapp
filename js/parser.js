const prec = {
  '+': 2,
  '-': 2,
  '×': 3,
  '÷': 3,
  '^': 4,
};

const assoc = {
  '+': 'left',
  '−': 'left',
  '×': 'left',
  '÷': 'left',
  '^': 'right',
};

function parse(tokens) {
  const outputStack = [];
  outputStack.makeASTNode = function (token) {
    const rightChild = this.pop();
    const leftChild = this.pop();
    this.push(new ASTNode(token, leftChild, rightChild));
  };
  const outputQueue = [];
  outputQueue.enqueue = outputQueue.push;
  const operatorStack = [];
  Token.prototype.precedence = function () {
    return prec[this.value];
  };
  Token.prototype.associativity = function () { return assoc[this.value]; };
  operatorStack.top = () => operatorStack[operatorStack.length - 1];
  tokens.forEach((token) => {
    // console.log(token);
    if (token.type === 'Literal') {
      outputStack.push(new ASTNode(token, null, null));
    } else if (token.type === 'Function') {
      operatorStack.push(token);
    } else if (token.type === 'Operator') {
      while (operatorStack.length
        && ((operatorStack.top().type === 'Function')
          || (operatorStack.top().precedence() > token.precedence())
          || (operatorStack.top().precedence() === token.precedence() && token.associativity() === 'left'))
        && operatorStack.top().type !== 'LParen') {
        outputStack.makeASTNode(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token.type === 'LParen') {
      operatorStack.push(token);
    } else if (token.type === 'RParen') {
      while (operatorStack.length && operatorStack.top().type !== 'LParen') {
        outputStack.makeASTNode(operatorStack.pop());
      }
      if (operatorStack.length && operatorStack.top().type === 'LParen') {
        operatorStack.pop();
      }
    }
  });
  while (operatorStack.length) {
    outputStack.makeASTNode(operatorStack.pop());
  }
  return outputStack.pop();
}
