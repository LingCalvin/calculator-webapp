function isPartOfNumber(ch) {
  return /\d|\./.test(ch);
}

function isLParen(ch) {
  return ch === '(';
}

function isRParen(ch) {
  return ch === ')';
}

function isOperator(ch) {
  return /\+|−|×|÷|\^/u.test(ch);
}

function isPlus(ch) {
  return ch === '+';
}
function isMinus(ch) {
  return /−|-/u.test(ch);
}
function isTimes(ch) {
  return ch === '×';
}
function isDivide(ch) {
  return ch === '÷';
}
function isExponentiate(ch) {
  return ch === '^';
}

function lex(str) {
  const tokens = [];
  tokens.top = function () {
    return tokens[tokens.length - 1];
  };
  let numberBuffer = [];
  str.split('').forEach((ch) => {
    if (numberBuffer.length && !isPartOfNumber(ch)) {
      tokens.push(new Token('literal', Number(numberBuffer.join(''))));
      numberBuffer = [];
    }
    if (isPartOfNumber(ch)) {
      numberBuffer.push(ch);
    } else if (isPlus(ch)) {
      tokens.push(new Token('plus', ch));
    } else if (isMinus(ch)) {
      tokens.push(new Token('minus', ch));
    } else if (isTimes(ch)) {
      tokens.push(new Token('times', ch));
    } else if (isDivide(ch)) {
      tokens.push(new Token('divide', ch));
    } else if (isExponentiate(ch)) {
      tokens.push(new Token('exponentiate', ch));
    } else if (isLParen(ch)) {
      tokens.push(new Token('lparen', ch));
    } else if (isRParen(ch)) {
      tokens.push(new Token('rparen', ch));
    } else {
      throw new Error(`Lexing Error: unrecognized token "${ch}"`);
    }
  });
  if (numberBuffer.length) {
    tokens.push(new Token('literal', Number(numberBuffer.join(''))));
  }
  return tokens;
}
