// Scientific Calculator Logic
class ScientificCalculator {
    constructor() {
        this.result = 0;
        this.currentInput = '';
        this.history = [];
    }

    // Basic arithmetic operations
    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    }

    // Advanced mathematical functions
    sin(x) {
        return Math.sin(x);
    }

    cos(x) {
        return Math.cos(x);
    }

    tan(x) {
        return Math.tan(x);
    }

    asin(x) {
        if (x < -1 || x > 1) {
            throw new Error("Invalid input for arcsine");
        }
        return Math.asin(x);
    }

    acos(x) {
        if (x < -1 || x > 1) {
            throw new Error("Invalid input for arccosine");
        }
        return Math.acos(x);
    }

    atan(x) {
        return Math.atan(x);
    }

    log(x) {
        if (x <= 0) {
            throw new Error("Invalid input for logarithm");
        }
        return Math.log10(x);
    }

    ln(x) {
        if (x <= 0) {
            throw new Error("Invalid input for natural logarithm");
        }
        return Math.log(x);
    }

    sqrt(x) {
        if (x < 0) {
            throw new Error("Invalid input for square root");
        }
        return Math.sqrt(x);
    }

    power(base, exponent) {
        return Math.pow(base, exponent);
    }

    exp(x) {
        return Math.exp(x);
    }

    factorial(n) {
        if (n < 0) {
            throw new Error("Factorial of negative number");
        }
        if (n === 0 || n === 1) {
            return 1;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    abs(x) {
        return Math.abs(x);
    }

    mod(a, b) {
        if (b === 0) {
            throw new Error("Modulo by zero");
        }
        return a % b;
    }

    floor(x) {
        return Math.floor(x);
    }

    ceil(x) {
        return Math.ceil(x);
    }

    pi() {
        return Math.PI;
    }

    e() {
        return Math.E;
    }

    // Convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Convert radians to degrees
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    // Main calculation function
    calculate(expression) {
        try {
            // Replace mathematical constants and functions
            expression = expression.replace(/pi/g, this.pi());
            expression = expression.replace(/e/g, this.e());
            
            // Replace functions with their JavaScript equivalents
            expression = expression.replace(/sin\(/g, 'Math.sin(');
            expression = expression.replace(/cos\(/g, 'Math.cos(');
            expression = expression.replace(/tan\(/g, 'Math.tan(');
            expression = expression.replace(/asin\(/g, 'Math.asin(');
            expression = expression.replace(/acos\(/g, 'Math.acos(');
            expression = expression.replace(/atan\(/g, 'Math.atan(');
            expression = expression.replace(/log\(/g, 'Math.log10(');
            expression = expression.replace(/ln\(/g, 'Math.log(');
            expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
            expression = expression.replace(/exp\(/g, 'Math.exp(');
            expression = expression.replace(/abs\(/g, 'Math.abs(');
            expression = expression.replace(/floor\(/g, 'Math.floor(');
            expression = expression.replace(/ceil\(/g, 'Math.ceil(');
            
            // Replace power operator
            expression = expression.replace(/\^/g, '**');
            
            // Replace factorial
            expression = expression.replace(/(\d+)!/g, (match, num) => this.factorial(parseInt(num)));
            
            // Evaluate the expression
            const result = eval(expression);
            
            if (isNaN(result)) {
                throw new Error("Invalid expression");
            }
            
            return result;
        } catch (error) {
            throw new Error("Calculation error: " + error.message);
        }
    }

    // Format number for display
    formatNumber(num) {
        if (num === Infinity || num === -Infinity) {
            return "Error";
        }
        
        // Handle very large or small numbers in scientific notation
        if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(6);
        }
        
        // Format to avoid long decimal strings
        const str = num.toString();
        if (str.length > 15) {
            return num.toPrecision(10);
        }
        
        return num;
    }
}

// Create a global calculator instance
const calculator = new ScientificCalculator();