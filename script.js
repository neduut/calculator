const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let current = '';
let expression = '';
let operator = null;
let firstNumber = null;
let lastResult = null;
let justCalculated = false;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    // Skaitmenys ir taskas
    if (!isNaN(value) || value === '.') {
      if (justCalculated) {
        current = '';
        expression = '';
        justCalculated = false;
      }
      current += value;
      expression += value;
      display.value = expression;
      adjustFontSize();
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
      display.value = expression;
      adjustFontSize();
      scrollToEnd();

    // Procentai – skaiciuoja procentine reiksme, bet neliecia rezultato
    } else if (value === '%') {
      if (firstNumber !== null && operator !== null) {
        const base = firstNumber;
        const percent = parseFloat(current || '0');
        const percentValue = base * (percent / 100);
        current = percentValue.toString();
        expression = base + ' ' + operator + ' ' + percentValue;
        display.value = expression;
        adjustFontSize();
        scrollToEnd();
      }

    // Lygybes mygtukas
    } else if (value === '=') {
      const parts = expression.split(' ');
      let num1 = parseFloat(parts[0]);
      let op = parts[1];
      let num2 = parseFloat(current || parts[2]);
      let result = 0;

      switch (op) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 === 0 ? '∞' : num1 / num2; break;
        case '^': result = Math.pow(num1, num2); break;
        case 'root': result = Math.pow(num2, 1 / num1); break;
      }

      display.value = result;
      adjustFontSize();
      lastResult = result;
      expression = result.toString();
      current = '';
      operator = null;
      justCalculated = true;

    // AC
    } else if (value === 'AC') {
      current = '';
      expression = '';
      operator = null;
      firstNumber = null;
      lastResult = null;
      display.value = '';
      justCalculated = false;

    // del
    } else if (value === 'del') {
      if (justCalculated) return;
      expression = expression.slice(0, -1);
      current = current.slice(0, -1);
      display.value = expression;
      adjustFontSize();
      scrollToEnd();

    // Kvadratine saknis
    } else if (value === '√') {
      const result = Math.sqrt(parseFloat(display.value || 0));
      display.value = result;
      adjustFontSize();
      lastResult = result;
      justCalculated = true;

    // Pi
    } else if (value === 'π') {
      if (justCalculated) {
        expression = '';
        current = '';
        justCalculated = false;
      }
      current = Math.PI.toString();
      expression += 'π';
      display.value = expression;
      adjustFontSize();
      scrollToEnd();

    // x²
    } else if (value === 'x²') {
      const num = parseFloat(display.value || 0);
      const result = Math.pow(num, 2);
      display.value = result;
      adjustFontSize();
      lastResult = result;
      justCalculated = true;

    // xʸ
    } else if (value === 'xʸ') {
      firstNumber = parseFloat(display.value || 0);
      operator = '^';
      expression = firstNumber + ' ^ ';
      current = '';
      display.value = expression;
      adjustFontSize();
      scrollToEnd();

    // ʸ√x
    } else if (value === 'ʸ√x') {
      firstNumber = parseFloat(display.value || 0);
      operator = 'root';
      expression = firstNumber + ' root ';
      current = '';
      display.value = expression;
      adjustFontSize();
      scrollToEnd();
    }
  });
});

function scrollToEnd() { // perkelia rodini i desine, kad visada matytusi paskutinis simbolis
  requestAnimationFrame(() => { // idejau dviguba patikrinima, nes pries tai kas antras skaitmuo nesimatydavo
    requestAnimationFrame(() => {
      display.scrollLeft = display.scrollWidth;
    });
  });
}

function adjustFontSize() {
  const maxFont = 34;
  const minFont = 16;
  const displayWidth = display.clientWidth - 20; // atimta padding
  const textWidth = getTextWidth(display.value, getComputedStyle(display).font);
  const scale = displayWidth / textWidth;

  if (scale < 1) {
    const newSize = Math.max(minFont, maxFont * scale);
    display.style.fontSize = newSize + 'px';
  } else {
    display.style.fontSize = maxFont + 'px';
  }
}

// Pagalbinė funkcija apskaičiuoja teksto plotį
function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

