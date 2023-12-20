document.addEventListener('DOMContentLoaded', function () {
    const display = document.querySelector('#screen');
    const buttons = document.getElementById('buttons');
    let currentInput = '';

    buttons.addEventListener('click', function (event) {
        const target = event.target;
        if (target.matches('button')) {
            if (target.classList.contains('digit') || target.classList.contains('bracket')) {
                currentInput += target.textContent.trim();
                display.textContent = currentInput;
            } else if (target.classList.contains('operation')) {
                const lastChar = currentInput.charAt(currentInput.length - 1);
                if (!'+-*/%'.includes(lastChar)) {
                    currentInput += target.textContent.trim();
                    display.textContent = currentInput;
                }
            } else if (target.classList.contains('clear')) {
                currentInput = '';
                display.textContent = '';
            } else if (target.classList.contains('result')) {
                try {
                    const compiledExpression = compile(currentInput);
                    const result = evaluate(compiledExpression);
                    display.textContent = result.toFixed(2);
                    currentInput = result.toString();
                } catch (error) {
                    display.textContent = 'Ошибка';
                    currentInput = '';
                }
            }
        }
    });

    function priority(operation) {
        if (operation === '+' || operation === '-') {
            return 1;
        }
        return 2;
    }

    function isNumeric(str) {
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    function tokenize(str) {
        return str.match(/[+\-*/()]|\d+\.\d+|\d+/g);
    }

    function compile(str) {
        const outputQueue = [];
        const operatorStack = [];
        const tokens = tokenize(str.replace(/\s+/g, ''));

        tokens.forEach(token => {
            if (isNumeric(token)) {
                outputQueue.push(token);
            } else if ('+-*/'.includes(token)) {
                while (operatorStack.length && priority(token) <= priority(operatorStack[operatorStack.length - 1])) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length > 0) {
                    operatorStack.pop();
                }
            }
        });

        while (operatorStack.length) {
            outputQueue.push(operatorStack.pop());
        }

        return outputQueue.join(' ');
    }

    function evaluate(expression) {
        const stack = [];
        expression.split(' ').forEach(token => {
            if (isNumeric(token)) {
                stack.push(parseFloat(token));
            } else if (stack.length >= 2) {
                const b = stack.pop(), a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        if (b === 0) {
                            throw new Error('Деление на ноль');
                        }
                        stack.push(a / b);
                        break;
                }
            }
        });
        return stack.pop();
    }
});
