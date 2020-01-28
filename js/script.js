function syncDisplayAndCaretBox() {
  const display = document.querySelector('#current-expression');
  const caretContainer = document.querySelector('#caret-box');
  caretContainer.scrollLeft = Math.max(display.scrollLeft, 0);
}

function syncCaretPosition() {
  const display = document.querySelector('#current-expression');
  const caretBox = document.querySelector('#caret-box');

  const t = Array(display.value.length + 1).fill(' ');
  t[display.selectionEnd] = '|';
  caretBox.value = t.join('');
  display.blur();
  display.focus();
}

function writeToDisplay(text) {
  const display = document.querySelector('#current-expression');
  const { selectionStart } = display;
  const { selectionEnd } = display;
  display.setRangeText(text, selectionStart, selectionEnd, 'end');
  syncCaretPosition();
}

function clearDisplay() {
  document.querySelector('#current-expression').value = '';
  syncCaretPosition();
}

function backspace() {
  const display = document.querySelector('#current-expression');
  let { selectionStart } = display;
  const { selectionEnd } = display;
  if (selectionStart === selectionEnd) {
    selectionStart = Math.max(0, selectionStart - 1);
  }
  display.setRangeText('', selectionStart, selectionEnd);
  syncCaretPosition();
}

document.querySelector('#current-expression').addEventListener('scroll', syncDisplayAndCaretBox);
document.querySelector('#current-expression').addEventListener('click', syncCaretPosition);

const printableButtons = document.querySelectorAll('button[data-printable]');

printableButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    writeToDisplay(e.target.textContent);
  });
});

function runShortcut(e) {
  if (e.ctrlKey) {
    return;
  }
  e.preventDefault();
  const button = document.querySelector(`button[data-key~="${e.key}"]`);
  if (!button) {
    return;
  }
  button.click();
}

document.addEventListener('keydown', runShortcut);

let longpressTimer;

document.querySelector('button[data-key~="Backspace"]').addEventListener('mousedown', () => {
  longpressTimer = setTimeout(clearDisplay, 1000);
});

document.querySelector('button[data-key~="Backspace"]').addEventListener('mouseup', () => {
  clearTimeout(longpressTimer);
});

document.querySelector('button[data-key~="Backspace"]').addEventListener('touchstart', () => {
  longpressTimer = setTimeout(clearDisplay, 1000);
});

document.querySelector('button[data-key~="Backspace"]').addEventListener('touchend', () => {
  clearTimeout(longpressTimer);
});

document.querySelector('button[data-key~="Backspace"]').addEventListener('click', backspace);

document.querySelector('button[data-key~="="]').addEventListener('click', () => {
  const display = document.querySelector('#current-expression');
  const expr = display.value;
  if (!expr.length) {
    return;
  }
  clearDisplay();
  const result = interpret(parse(lex(expr)));
  writeToDisplay(toPrecisionTrimmed(result, 12));
});
