// modules/math.js
// ============================================================
// Named exports: multiple values exported from a single module.
// Import with: import { add, subtract, PI } from './modules/math.js'
// ============================================================

// Named export: a constant
export const PI = 3.14159265358979;

// Named export: a function
export function add(a, b) {
  return a + b;
}

// Named export: a function
export function subtract(a, b) {
  return a - b;
}

// Named export: a function
export function multiply(a, b) {
  return a * b;
}

// Named export: a function
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

// Named export: a function using another export from the same module
export function circleArea(radius) {
  return PI * radius * radius;
}
