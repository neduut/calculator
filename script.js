const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let current = ''; // dabartinis įvedamas skaičius
let expression = ''; // viso veiksmo tekstas
let operator = null;
let firstNumber = null;
let memory = 0; // M funkcijos

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (!isNaN(value) || value === '.') {
      current += value;
      expression += value;
      display.value = expression;

    } else if (['+', '-', '*', '/', '%'].includes(value)) {
      if (current === '' && expression === '') return; // ignoruoja jei nieko nera
      firstNumber = parseFloat(current);
      operator = value;
      expression += ' ' + value + ' ';
      current = '';
      display.value = expression;

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
        case '%': result = num1 % num2; break;
      }

      display.value = result;
      expression = result.toString();
      current = '';
      operator = null;

    // C – isvalo po viena simboli
    } else if (value === 'C') {
      current = current.slice(0, -1);
      expression = expression.slice(0, -1);
      display.value = expression;

    // AC – isvalo viska, iskaitant atminti
    } else if (value === 'AC') {
      current = '';
      expression = '';
      operator = null;
      firstNumber = null;
      memory = 0;
      display.value = '';

    // M+ – prideda prie atminties
    } else if (value === 'M+') {
      memory += parseFloat(display.value || 0);

    // M- – atima is atminties
    } else if (value === 'M-') {
      memory -= parseFloat(display.value || 0);

    // MRC – rodo atminties reiksme
    } else if (value === 'MRC') {
      display.value = memory;
      expression = memory.toString();
      current = memory.toString();

    // kvadratine saknis
    } else if (value === '√') {
      const result = Math.sqrt(parseFloat(display.value || 0));
      display.value = result;
      expression = result.toString();
      current = result.toString();

    // pi konstanta
    } else if (value === 'π') {
      current = Math.PI.toString();
      expression += 'π';
      display.value = expression;
    }
  });
});
