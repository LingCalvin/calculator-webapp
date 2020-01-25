function isPartOfNumber(ch) {
  return /\d|\./.test(ch);
}

function isLParen(ch) {
  return ch === '(';
}

function isRParen(ch) {
  return ch === ')';
}

function isBinaryOperator(ch) {
  return /\+|−|×|÷|\^/u.test(ch);
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

function lex(str) {
  const tokens = [];
  let numberBuffer = [];
  str.split('').forEach((ch) => {
    if (numberBuffer.length && !isPartOfNumber(ch)) {
      tokens.push(new Token('Literal', Number(numberBuffer.join(''))));
      numberBuffer = [];
    }
    if (isPartOfNumber(ch)) {
      numberBuffer.push(ch);
    } else if (isBinaryOperator(ch)) {
      tokens.push(new Token('Operator', ch));
    } else if (isLParen(ch)) {
      tokens.push(new Token('LParen', ch));
    } else if (isRParen(ch)) {
      tokens.push(new Token('RParen', ch));
    } else {
      throw new Error(`Lexing Error: unrecognized token "${ch}"`);
    }
  });
  if (numberBuffer.length) {
    tokens.push(new Token('Literal', Number(numberBuffer.join(''))));
  }
  return tokens;
}
