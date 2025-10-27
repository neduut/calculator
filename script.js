// kintamuju inicijavimas
const expressionDiv = document.getElementById('expression'); // virsutine eilute
const resultDiv = document.getElementById('result'); // apatine eilute
const buttons = document.querySelectorAll('button'); // visi mygtukai
const delBtn = document.getElementById('del-btn'); // del mygtukas

let current = ''; // dabartinis ivedamas skaicius
let expression = ''; // visa skaiciavimo israiska
let operator = null; // dabartinis ivedamas operatorius
let firstNumber = null; // pirmas skaicius
let lastResult = null; // paskutinis rezultatas
let justCalculated = false; // ar buvo atliktas skaiciavimas
let openParenthesis = 0; // skaiciuoja atidarytu skliaustu kieki

// mygtuku paspaudimu valdymas
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // skaitmenys ir taskas
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

    // operatoriai
    } else if (['+', '-', '*', '/'].includes(value)) {
      // leidzia minusa priekyje (neigiamas skaicius)
      if (current === '' && expression === '' && value === '-') {
        expression = '-';
        current = '-';
        resultDiv.textContent = expression;
        scrollToEnd();
        return;
      }
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

    // skliaustai ( )
    } else if (value === '( )') {
      if (justCalculated) {
        current = '';
        expression = '';
        expressionDiv.textContent = '';
        justCalculated = false;
      }
      // jei yra neuzdarytu skliaustu, uzdaro
      if (openParenthesis > 0 && current !== '') {
        expression += ')';
        openParenthesis--;
      } else {
      // atidaryti nauja skliausta
        expression += '(';
        openParenthesis++;
      }
      resultDiv.textContent = expression;
      scrollToEnd();

  // procentu iraiska a% -> (a/100)
    } else if (value === '%') {
  // irasome tik jei turime kairi operanda (skaiciu, pi arba uzdara skliausta)
      const lastChar = expression.trim().slice(-1);
      if (/[0-9)π]/.test(lastChar)) {
        expression += '%';
        current = '';
        resultDiv.textContent = expression;
        scrollToEnd();
      }

    // lygybes mygtukas
    } else if (value === '=') {
  // uzdaryti visus neuzdarytus skliaustus
      while (openParenthesis > 0) {
        expression += ')';
        openParenthesis--;
      }

      // klaidu gaudymas
      // eval() paima string ir paleidzia ji kaip js koda
      try {
        const evalExpression = normalizeForEval(expression);
        const result = eval(evalExpression);

        // tikrina ar ne NaN (bet leidzia Infinity)
        if (isNaN(result)) {
          resultDiv.textContent = 'Error';
          return;
        }

        expressionDiv.textContent = expression;
        // jei skaicius labai didelis, rodo eksponentine notacija
        let resultText;
        if (!isFinite(result)) {
          // jei didesnis nei 1.7976931348623157e+308 rodo infinity
          resultText = result > 0 ? '∞' : '-∞';
        } else if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-6 && result !== 0)) {
          resultText = result.toExponential(6);
        } else {
          resultText = result.toString();
        }
        resultDiv.textContent = resultText;
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

  // kvadratine saknis (iraso operatoriu, neskaiciuoja iskart)
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

    // pi
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

  // saknies israiska y sqrt x (a root b => b ** (1/a))
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

// del mygtukas (trina po viena simboli)
delBtn.addEventListener('click', () => {
  // rezultata irgi trina po viena simboli
  if (justCalculated) {
    justCalculated = false;
  }
  deleteLastToken();
});

function deleteLastToken() {
  if (!expression || expression.length === 0) return;

  // pasalina galinius tarpus
  let s = expression.replace(/\s+$/g, '');

  // skaiciavimu eiliskumas
  if (s.endsWith(' root ')) {
    s = s.slice(0, -6); 
  } else if (s.endsWith(' ^ ')) {
    s = s.slice(0, -3); 
  } else if (s.endsWith('√(')) {
    s = s.slice(0, -2);
    openParenthesis = Math.max(0, openParenthesis - 1);
  } else if (s.endsWith('%') || s.endsWith('π')) {
    s = s.slice(0, -1);
  } else {
    // skliaustai ar skaitmenys/operatoriai po viena simboli
    const lastChar = s.slice(-1);
    if (lastChar === ')') {
      // panaikinus galini ), atlaisvina viena atidaryma
      openParenthesis++;
    } else if (lastChar === '(') {
      openParenthesis = Math.max(0, openParenthesis - 1);
    }
    s = s.slice(0, -1);
  }

  expression = s;

  // atnaujina current i paskutini skaiciu (jei yra)
  const m = expression.match(/([0-9]+(?:\.[0-9]+)?)$/);
  current = m ? m[1] : '';

  resultDiv.textContent = expression;
  scrollToEnd();
}

// uztikrina, kad kai israiska ilga, rodymas auto pasislenka i desine, kad matytus nauji simboliai
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

  // PGR simboliu pakeitimai
  s = s.replace(/×/g, '*')
       .replace(/÷/g, '/')
       .replace(/π/g, String(Math.PI))
       .replace(/√\(/g, 'Math.sqrt(')
       .replace(/\^/g, '**'); // laipsnis

  // pakeicia saknies israiska
  s = replaceBinaryOperator(s, ' root ', (left, right) => `(${right}) ** (1/(${left}))`);

  // pakeisti procentu israiska
  s = replacePostfixPercent(s);

  return s;
}

// pakeicia dvejetaini operatoriu issireiskimus pagal builder funkcija
function replaceBinaryOperator(expr, opToken, builder) {
  let s = expr;
  let idx;
  while ((idx = s.indexOf(opToken)) !== -1) {
    const left = getLeftOperand(s, idx);
    const right = getRightOperand(s, idx + opToken.length);
    if (!left || !right) break; // negali pakeisti be abieju operandu
    const before = s.slice(0, left.start);
    const after = s.slice(right.end);
    const replacement = builder(left.text, right.text);
    s = before + replacement + after;
  }
  return s;
}

// pakeicia postfix '%' issireiskimus pagal (operand/100)
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
    // atgal iki porinio skliausto (
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
