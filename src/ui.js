// UI-related functions for the scientific calculator
import { appendToDisplay, clearDisplay, deleteLast, calculate } from './calculator.js';

export function setupCalculatorUI() {
    // This function can be used to set up additional UI features
    console.log('Calculator UI initialized');
}

// Set up event listeners for buttons
export function setupButtonListeners() {
    // Buttons are already set up in HTML with onclick attributes
    // This is just a placeholder for potential future enhancements
    console.log('Button listeners set up');
}

// Initialize the calculator UI
document.addEventListener('DOMContentLoaded', function() {
    setupCalculatorUI();
    setupButtonListeners();
});