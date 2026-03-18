// Simple test for calculator functionality
const fs = require('fs');

// Read the calculator file
const calculatorContent = fs.readFileSync('calculator.js', 'utf8');

// Basic checks
console.log("=== Calculator Logic Test ===");
console.log("File size:", calculatorContent.length, "characters");

if (calculatorContent.includes('class Calculator')) {
    console.log("✓ Calculator class defined");
} else {
    console.log("✗ Calculator class not found");
}

if (calculatorContent.includes('compute()')) {
    console.log("✓ Compute method exists");
} else {
    console.log("✗ Compute method not found");
}

if (calculatorContent.includes('calculateFunction')) {
    console.log("✓ calculateFunction method exists");
} else {
    console.log("✗ calculateFunction method not found");
}

// Check for scientific functions
const scientificFunctions = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pow', 'exp', 'pi', 'factorial', 'abs', 'reciprocal', 'square'];
let allFound = true;
scientificFunctions.forEach(func => {
    if (calculatorContent.includes(`case '${func}'`)) {
        console.log(`✓ Function '${func}' found`);
    } else {
        console.log(`✗ Function '${func}' not found`);
        allFound = false;
    }
});

if (allFound) {
    console.log("✓ All scientific functions present");
} else {
    console.log("✗ Some scientific functions missing");
}

console.log("=== Test Complete ===");