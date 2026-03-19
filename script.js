// Calculator functions - This is the compiled JavaScript version of the TypeScript implementation
let display = document.getElementById('result');

// Exported functions for use in HTML onclick handlers
window.appendToDisplay = function(value) {
    display.value += value;
};

window.clearDisplay = function() {
    display.value = '';
};

window.deleteLast = function() {
    display.value = display.value.slice(0, -1);
};

window.calculate = function() {
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
};

// Allow keyboard input
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

// Handle scientific functions input
window.handleScientificFunction = function(func) {
    appendToDisplay(func);
};