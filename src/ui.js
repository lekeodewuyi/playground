// UI Controller for Scientific Calculator

// Global variables
let currentInput = '';
let lastResult = 0;

// Append to display
function appendToDisplay(value) {
    const display = document.getElementById('result');
    if (display) {
        display.value += value;
    }
}

// Clear display
function clearDisplay() {
    const display = document.getElementById('result');
    if (display) {
        display.value = '';
    }
}

// Backspace function
function backspace() {
    const display = document.getElementById('result');
    if (display) {
        const currentValue = display.value;
        display.value = currentValue.slice(0, -1);
    }
}

// Calculate result
function calculate() {
    const display = document.getElementById('result');
    if (!display || !display.value) return;

    try {
        // Get the expression from display
        let expression = display.value;
        
        // Replace special symbols with JavaScript equivalents
        expression = expression.replace(/×/g, '*');
        expression = expression.replace(/π/g, Math.PI);
        expression = expression.replace(/e/g, Math.E);
        
        // Handle factorial (n!)
        expression = expression.replace(/(\d+)!/g, (match, num) => {
            return calculator.factorial(parseInt(num));
        });
        
        // Handle power operator
        expression = expression.replace(/\^/g, '**');
        
        // Evaluate the expression using the calculator's evaluate method
        const result = calculator.calculate(expression);
        
        // Display the result
        display.value = calculator.formatNumber(result);
        lastResult = result;
    } catch (error) {
        display.value = 'Error';
        console.error('Calculation error:', error);
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('result');
    if (display) {
        display.focus();
    }
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Allow numbers, operators, and special keys
        if (/[\d+\-*/.()^]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
            if (key === 'Enter') {
                calculate();
            } else if (key === 'Escape') {
                clearDisplay();
            } else if (key === 'Backspace') {
                backspace();
            } else {
                appendToDisplay(key);
            }
            event.preventDefault();
        }
    });
});