// Calculator functions implemented in TypeScript
let display = document.getElementById('result') as HTMLInputElement;

export function appendToDisplay(value: string): void {
    display.value += value;
}

export function clearDisplay(): void {
    display.value = '';
}

export function deleteLast(): void {
    display.value = display.value.slice(0, -1);
}

export function calculate(): void {
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
export function setupKeyboardListeners(): void {
    document.addEventListener('keydown', function(event: KeyboardEvent) {
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
export function handleScientificFunction(func: string): void {
    appendToDisplay(func);
}