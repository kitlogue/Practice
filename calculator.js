let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetInput = false;
let expression = '';

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');

function updateDisplay() {
  resultEl.textContent = formatNumber(currentInput);
  resultEl.classList.toggle('small', currentInput.length > 9);
  expressionEl.textContent = expression;
}

function formatNumber(value) {
  if (value === 'Error') return 'Error';
  const num = parseFloat(value);
  if (isNaN(num)) return value;

  // Handle very large or very small numbers
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(5);
  }

  // Format with locale but limit decimal places
  const str = value.toString();
  const parts = str.split('.');
  if (parts[1]) {
    // Keep trailing dot and zeros while typing
    return num.toLocaleString('en-US', { maximumFractionDigits: 10 }) +
      (str.endsWith('.') ? '.' : '');
  }
  return num.toLocaleString('en-US');
}

function inputDigit(digit) {
  if (shouldResetInput) {
    currentInput = digit;
    shouldResetInput = false;
  } else {
    if (currentInput === '0' && digit !== '.') {
      currentInput = digit;
    } else if (currentInput.length < 15) {
      currentInput += digit;
    }
  }
  updateDisplay();
}

function inputDot() {
  if (shouldResetInput) {
    currentInput = '0.';
    shouldResetInput = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function setOperator(op) {
  if (operator && !shouldResetInput) {
    calculate(true);
  }

  previousInput = currentInput;
  operator = op;
  shouldResetInput = true;

  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  expression = formatNumber(previousInput) + ' ' + opSymbols[op];
  updateDisplay();

  // Highlight active operator button
  document.querySelectorAll('.btn-orange').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

function calculate(chained = false) {
  if (!operator || previousInput === '') return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      if (curr === 0) {
        currentInput = 'Error';
        expression = '';
        operator = null;
        previousInput = '';
        shouldResetInput = true;
        updateDisplay();
        return;
      }
      result = prev / curr;
      break;
    default: return;
  }

  if (!chained) {
    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    expression = formatNumber(previousInput) + ' ' + opSymbols[operator] + ' ' + formatNumber(currentInput) + ' =';
  }

  currentInput = String(parseFloat(result.toPrecision(12)));
  operator = null;
  previousInput = '';
  shouldResetInput = true;

  document.querySelectorAll('.btn-orange').forEach(btn => btn.classList.remove('active'));
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetInput = false;
  expression = '';
  document.querySelectorAll('.btn-orange').forEach(btn => btn.classList.remove('active'));
  updateDisplay();
}

function toggleSign() {
  if (currentInput === '0' || currentInput === 'Error') return;
  currentInput = currentInput.startsWith('-')
    ? currentInput.slice(1)
    : '-' + currentInput;
  updateDisplay();
}

function percentage() {
  if (currentInput === 'Error') return;
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDot();
  else if (e.key === '+') setOperatorKey('+');
  else if (e.key === '-') setOperatorKey('-');
  else if (e.key === '*') setOperatorKey('*');
  else if (e.key === '/') { e.preventDefault(); setOperatorKey('/'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === '%') percentage();
});

function setOperatorKey(op) {
  const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const btnLabels = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  if (operator && !shouldResetInput) {
    calculate(true);
  }

  previousInput = currentInput;
  operator = op;
  shouldResetInput = true;

  expression = formatNumber(previousInput) + ' ' + opSymbols[op];
  updateDisplay();
}

function backspace() {
  if (shouldResetInput || currentInput === 'Error') return;
  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

updateDisplay();
