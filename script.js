const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');
const buttons = document.querySelectorAll('button');
const delBtn = document.getElementById('del-btn');

let current = '';
let expression = '';
let operator = null;
let firstNumber = null;
let lastResult = null;
let justCalculated = false;
let openParenthesis = 0; // skaiciuoja atidarytus skliaustu kieki

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // Skaitmenys ir taskas
    if (!isNaN(value) || value === '.') {
      if (justCalculated) {
        current = '';
        expression = '';
        expressionDiv.textContent = '';
        justCalculated = false;
      }
      current += value;
      expression += value;
      resultDiv.textContent = expression;
      scrollToEnd();

    // Operatoriai
    } else if (['+', '-', '*', '/'].includes(value)) {
      if (current === '' && expression === '') return;
      if (justCalculated) {
        expression = lastResult.toString();
        justCalculated = false;
      }
      firstNumber = parseFloat(current);
      operator = value;
      expression += ' ' + value + ' ';
      current = '';
      resultDiv.textContent = expression;
      scrollToEnd();

    // Skliaustai ( )
    } else if (value === '( )') {
      if (justCalculated) {
        current = '';
        expression = '';
        expressionDiv.textContent = '';
        justCalculated = false;
      }
  // Jei yra neuzdarytu skliaustu, uzdaryti
      if (openParenthesis > 0 && current !== '') {
        expression += ')';
        openParenthesis--;
      } else {
  // Atidaryti nauja skliausta
        expression += '(';
        openParenthesis++;
      }
      resultDiv.textContent = expression;
      scrollToEnd();

  // Procentai - veikia kaip postfiksinis operatorius: a% -> (a/100)
    } else if (value === '%') {
  // Irasome tik jei turime kairi operanda (skaiciu, pi arba uzdara skliausta)
      const lastChar = expression.trim().slice(-1);
      if (/[0-9)π]/.test(lastChar)) {
        expression += '%';
        current = '';
        resultDiv.textContent = expression;
        scrollToEnd();
      }

    // Lygybes mygtukas
    } else if (value === '=') {
  // Uzdaryti visus neuzdarytus skliaustus
      while (openParenthesis > 0) {
        expression += ')';
        openParenthesis--;
      }

      try {
        const evalExpression = normalizeForEval(expression);
        const result = eval(evalExpression);

        expressionDiv.textContent = expression;
        resultDiv.textContent = result;
        lastResult = result;
        expression = result.toString();
        current = '';
        operator = null;
        openParenthesis = 0;
        justCalculated = true;
      } catch (error) {
        resultDiv.textContent = 'Error';
      }
    // AC
    } else if (value === 'AC') {
      current = '';
      expression = '';
      operator = null;
      firstNumber = null;
      lastResult = null;
      openParenthesis = 0;
      expressionDiv.textContent = '';
      resultDiv.textContent = '';
      justCalculated = false;

  // Kvadratine saknis (iraso operatoriu, neskaiciuoja iskart)
    } else if (value === '√') {
      if (justCalculated) {
  // pradedam nauja israiska nuo sqrt(
        expression = '';
        expressionDiv.textContent = '';
        justCalculated = false;
      }
      expression += '√(';
      openParenthesis++;
      current = '';
      resultDiv.textContent = expression;
      scrollToEnd();

    // Pi
    } else if (value === 'π') {
      if (justCalculated) {
        expression = '';
        current = '';
        expressionDiv.textContent = '';
        justCalculated = false;
      }
      current = Math.PI.toString();
      expression += 'π';
      resultDiv.textContent = expression;
      scrollToEnd();

  // x^2 (postfiksinis kvadrato operatorius)
    } else if (value === 'x²') {
      const lastChar = expression.trim().slice(-1);
      if (/[0-9)π]/.test(lastChar)) {
        expression += ' ^ 2';
        current = '';
        resultDiv.textContent = expression;
        scrollToEnd();
      }

  // x^y (iterpia dvejetaini laipsnio operatoriu)
    } else if (value === 'xʸ') {
      const lastChar = expression.trim().slice(-1);
      if (/[0-9)π]/.test(lastChar)) {
        expression += ' ^ ';
        current = '';
        resultDiv.textContent = expression;
        scrollToEnd();
      }

  // y sqrt x (iterpia dvejetaini 'root' operatoriu: a root b => b ** (1/a))
    } else if (value === 'ʸ√x') {
      const lastChar = expression.trim().slice(-1);
      if (/[0-9)π]/.test(lastChar)) {
        expression += ' root ';
        current = '';
        resultDiv.textContent = expression;
        scrollToEnd();
      }
    }
  });
});

// del mygtukas
delBtn.addEventListener('click', () => {
  if (justCalculated) return;
  expression = expression.slice(0, -1);
  current = current.slice(0, -1);
  resultDiv.textContent = expression;
  scrollToEnd();
});

function scrollToEnd() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      expressionDiv.scrollLeft = expressionDiv.scrollWidth;
      resultDiv.scrollLeft = resultDiv.scrollWidth;
    });
  });
}

// konvertuoja simboliu i javascript sintakse eval funkcijai
function normalizeForEval(expr) {
  if (!expr || typeof expr !== 'string') return '';

  let s = expr;

  // PGR pakeitimai
  s = s.replace(/×/g, '*')
       .replace(/÷/g, '/')
       .replace(/π/g, String(Math.PI))
       .replace(/√\(/g, 'Math.sqrt(')
       .replace(/\^/g, '**'); // laipsnis

  // pakeisti 'a root b' -> (b) ** (1/(a))
  s = replaceBinaryOperator(s, ' root ', (left, right) => `(${right}) ** (1/(${left}))`);

  // pakeisti postfix '%' -> ((operand)/100)
  s = replacePostfixPercent(s);

  return s;
}

function replaceBinaryOperator(expr, opToken, builder) {
  let s = expr;
  let idx;
  while ((idx = s.indexOf(opToken)) !== -1) {
    const left = getLeftOperand(s, idx);
    const right = getRightOperand(s, idx + opToken.length);
    if (!left || !right) break; // nesigauna patikimai
    const before = s.slice(0, left.start);
    const after = s.slice(right.end);
    const replacement = builder(left.text, right.text);
    s = before + replacement + after;
  }
  return s;
}

function replacePostfixPercent(expr) {
  let s = expr;
  let idx;
  while ((idx = s.indexOf('%')) !== -1) {
    const left = getLeftOperand(s, idx);
    if (!left) break;
    const before = s.slice(0, left.start);
    const after = s.slice(idx + 1);
    s = `${before}((${left.text})/100)${after}`;
  }
  return s;
}

// randa kairi operanda, atsizvelgiant i skliaustus
function getLeftOperand(s, endIdx) { // endIdx - operatoriaus pradzia
  let i = endIdx - 1;
  // praleidziam tarpus
  while (i >= 0 && s[i] === ' ') i--;
  if (i < 0) return null;

  if (s[i] === ')') {
    // atgal iki porinio '('
    let depth = 1; i--;
    while (i >= 0 && depth > 0) {
      if (s[i] === ')') depth++;
      else if (s[i] === '(') depth--;
      i--;
    }
    const start = i + 1;
    return { start, end: endIdx, text: s.slice(start, endIdx).trim() };
  } else {
  // skaicius / pi / taskai
    let start = i;
    while (start >= 0 && /[0-9\.π]/.test(s[start])) start--;
    start++;
    if (start >= endIdx) return null;
    return { start, end: endIdx, text: s.slice(start, endIdx).trim() };
  }
}

// randa desini operanda, atsizvelgiant i skliaustus
function getRightOperand(s, startIdx) { // startIdx - po operatoriaus pabaigos
  let i = startIdx;
  // praleidziam tarpus
  while (i < s.length && s[i] === ' ') i++;
  if (i >= s.length) return null;

  if (s[i] === '(') {
    let depth = 1; i++;
    while (i < s.length && depth > 0) {
      if (s[i] === '(') depth++;
      else if (s[i] === ')') depth--;
      i++;
    }
    const end = i;
    return { start: startIdx, end, text: s.slice(startIdx, end).trim() };
  } else {
    let end = i;
    while (end < s.length && /[0-9\.π]/.test(s[end])) end++;
    if (end === i) return null;
    return { start: i, end, text: s.slice(i, end).trim() };
  }
}
