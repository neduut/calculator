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
let openParenthesis = 0; // skaiciuoja atidarytus skliaustu kiekį

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
      // Jei yra neuzdarytų skliaustų, uždaryti
      if (openParenthesis > 0 && current !== '') {
        expression += ')';
        openParenthesis--;
      } else {
        // Atidaryti naują skliaustą
        expression += '(';
        openParenthesis++;
      }
      resultDiv.textContent = expression;
      scrollToEnd();

    // Procentai – skaiciuoja procentine reiksme, bet neliecia rezultato
    } else if (value === '%') {
      if (firstNumber !== null && operator !== null) {
        const base = firstNumber;
        const percent = parseFloat(current || '0');
        const percentValue = base * (percent / 100);
        current = percentValue.toString();
        expression = base + ' ' + operator + ' ' + percentValue;
        resultDiv.textContent = expression;
        scrollToEnd();
      }

    // Lygybes mygtukas
    } else if (value === '=') {
      // Uždaryti visus neuždarytus skliaustu
      while (openParenthesis > 0) {
        expression += ')';
        openParenthesis--;
      }
      
      try {
        // Naudojam eval, bet pakeičiam operatorius į JavaScript formatą
        let evalExpression = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, Math.PI);
        
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

    // Kvadratine saknis
    } else if (value === '√') {
      const result = Math.sqrt(parseFloat(resultDiv.textContent || current || 0));
      expressionDiv.textContent = '';
      resultDiv.textContent = result;
      lastResult = result;
      justCalculated = true;

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

    // x²
    } else if (value === 'x²') {
      const num = parseFloat(resultDiv.textContent || current || 0);
      const result = Math.pow(num, 2);
      expressionDiv.textContent = '';
      resultDiv.textContent = result;
      lastResult = result;
      justCalculated = true;

    // xʸ
    } else if (value === 'xʸ') {
      firstNumber = parseFloat(resultDiv.textContent || current || 0);
      operator = '^';
      expression = firstNumber + ' ^ ';
      current = '';
      resultDiv.textContent = expression;
      scrollToEnd();

    // ʸ√x
    } else if (value === 'ʸ√x') {
      firstNumber = parseFloat(resultDiv.textContent || current || 0);
      operator = 'root';
      expression = firstNumber + ' root ';
      current = '';
      resultDiv.textContent = expression;
      scrollToEnd();
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
