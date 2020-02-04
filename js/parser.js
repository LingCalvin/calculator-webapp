import Token from './token.js';
import ASTNode from './ast_node.js';

const operators = new Set(['plus', 'minus', 'times', 'divide', 'exponentiate', 'negate', 'unaryplus']);

const precedence = new Map([
  ['plus', 2],
  ['minus', 2],
  ['times', 3],
  ['divide', 3],
  ['negate', 4],
  ['unaryplus', 4],
  ['exponentiate', 5],
]);

const associativity = new Map([
  ['plus', 'left'],
  ['minus', 'left'],
  ['times', 'left'],
  ['divide', 'left'],
  ['negate', 'left'],
  ['unaryplus', 'left'],
  ['exponentiate', 'right'],
]);

const numOperands = new Map([
  ['negate', 1],
  ['unaryplus', 1],
  ['plus', 2],
  ['minus', 2],
  ['times', 2],
  ['divide', 2],
  ['exponentiate', 2],
  ['literal', 0],
]);

function isSubExpressionStart(token) {
  return !token || operators.has(token.type) || token.type === 'lparen';
}

function preprocessUnary(tokens) {
  let previousToken;
  return tokens.map((token) => {
    const startNewSubExpression = isSubExpressionStart(previousToken);
    const currentToken = token;
    if (token.type === 'minus' && startNewSubExpression) {
      currentToken.type = 'negate';
    } else if (token.type === 'plus' && startNewSubExpression) {
      currentToken.type = 'unaryplus';
    }
    previousToken = currentToken;
    return currentToken;
  });
}

// ['lparen', 'rparen'].some((ele) => ele === currentToken.type)
// ['lparen', 'literal'].includes(currentToken.type);

function hasImplicitTimes(previousToken, currentToken) {
  return (previousToken
         && ((previousToken.type === 'rparen' && ['lparen', 'literal'].includes(currentToken.type))
             || (previousToken.type === 'literal' && currentToken.type === 'lparen')));
}

function preprocessImplicit(tokens) {
  let previousToken;
  const processedTokens = [];
  tokens.forEach((token) => {
    if (hasImplicitTimes(previousToken, token)) {
      processedTokens.push(new Token('times', '×'));
    }
    processedTokens.push(token);
    previousToken = token;
  });
  return processedTokens;
}

function preprocess(tokens) {
  return preprocessImplicit(preprocessUnary(tokens));
}

function operatorHasHigherPriority(a, b) {
  return ((associativity.get(b.type) === 'left' && precedence.get(b.type) <= precedence.get(a.type))
    || (associativity.get(b.type) === 'right' && precedence.get(b.type) < precedence.get(a.type)));
}

function processPreceedingOperators(token, operatorStack, outputStack) {
  while (operatorStack.length
    && operatorHasHigherPriority(operatorStack.top(), token)
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
    const numberOfChildren = numOperands.get(token.type);
    const children = this.splice(this.length - numberOfChildren, numberOfChildren);
    this.push(new ASTNode(token, children));
  };
  const operatorStack = [];
  operatorStack.top = () => operatorStack[operatorStack.length - 1];
  tokens.forEach((token) => {
    if (token.type === 'literal') {
      outputStack.makeASTNode(token);
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

export { parse as default };
