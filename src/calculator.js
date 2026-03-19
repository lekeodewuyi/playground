// Calculator functions implemented in JavaScript (compatible with TypeScript)
let display = document.getElementById('result');

export function appendToDisplay(value) {
    display.value += value;
}

export function clearDisplay() {
    display.value = '';
}

export function deleteLast() {
    display.value = display.value.slice(0, -1);
}

export function calculate() {
    try {
        // Replace symbols for JavaScript evaluation
        let expression = display.value
            .replace(/×/g, '*')
            .replace(/π/g, Math.PI.toString())
            .replace(/e/g, Math.E.toString());
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle special cases
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            // Format the result to avoid long decimals
            display.value = parseFloat(result.toFixed(10)).toString();
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Allow keyboard input
export function setupKeyboardListeners() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if ((key >= '0' && key <= '9') || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')') {
            appendToDisplay(key);
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape') {
            clearDisplay();
        } else if (key === 'Backspace') {
            deleteLast();
        }
    });
}

// Handle scientific functions input
export function handleScientificFunction(func) {
    appendToDisplay(func);
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardListeners();
});