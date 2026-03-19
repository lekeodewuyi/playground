// Main calculator application
import { appendToDisplay, clearDisplay, deleteLast, calculate, setupKeyboardListeners } from './calculator';

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardListeners();
});