document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('button');
    const clear = document.getElementById('clear');
    const equals = document.getElementById('equals');
  
    let expression = '';
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.id === 'clear') {
          expression = '';
          display.value = '';
        } else if (button.id === 'equals') {
          try {
            expression = eval(expression).toString();
            display.value = expression;
          } catch (error) {
            display.value = 'Error';
            expression = '';
          }
        } else {
          expression += button.getAttribute('data-value');
          display.value = expression;
        }
      });
    });
  });
  
  