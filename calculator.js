// Scientific Calculator Logic
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetNextInput = false;
        this.waitingForOperand = false;
    }

    delete() {
        if (this.resetNextInput) return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.resetNextInput) {
            this.currentOperand = '0';
            this.resetNextInput = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.resetNextInput = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetNextInput = true;
    }

    // Scientific functions
    calculateFunction(funcName) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        
        switch (funcName) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180); // Convert to radians
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180); // Convert to radians
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180); // Convert to radians
                break;
            case 'log':
                if (current <= 0) {
                    result = 'Error';
                } else {
                    result = Math.log10(current);
                }
                break;
            case 'ln':
                if (current <= 0) {
                    result = 'Error';
                } else {
                    result = Math.log(current);
                }
                break;
            case 'sqrt':
                if (current < 0) {
                    result = 'Error';
                } else {
                    result = Math.sqrt(current);
                }
                break;
            case 'pow':
                // For power function, we need to handle it differently
                this.previousOperand = current;
                this.operation = '^';
                this.resetNextInput = true;
                return;
            case 'exp':
                result = Math.exp(current);
                break;
            case 'pi':
                this.currentOperand = Math.PI.toString();
                this.resetNextInput = true;
                return;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    result = 'Error';
                } else {
                    result = this.factorial(current);
                }
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            case 'reciprocal':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = 1 / current;
                }
                break;
            case 'square':
                result = Math.pow(current, 2);
                break;
            default:
                return;
        }
        
        this.currentOperand = result.toString();
        this.resetNextInput = true;
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
        this.resetNextInput = true;
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null && this.previousOperand !== '') {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = this.previousOperand;
        }
    }
}

// Initialize calculator
const previousOperandElement = document.querySelector('[data-previous-operand]');
const currentOperandElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Button event listeners
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operation);
        calculator.updateDisplay();
    });
});

document.querySelector('[data-action="equals"]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.querySelector('[data-action="decimal"]').addEventListener('click', () => {
    calculator.appendNumber('.');
    calculator.updateDisplay();
});

document.querySelector('[data-action="percentage"]').addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
});

document.querySelectorAll('[data-function]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.calculateFunction(button.dataset.function);
        calculator.updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', event => {
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    }
    if (event.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    }
    if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        let operation;
        switch (event.key) {
            case '*': operation = '×'; break;
            case '/': operation = '÷'; break;
            default: operation = event.key;
        }
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    }
    if (event.key === 'Enter' || event.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    }
    if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
    if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (event.key === '%') {
        calculator.percentage();
        calculator.updateDisplay();
    }
});