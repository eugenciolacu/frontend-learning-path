// src/good-code.js
// ============================================================
// This file shows the same logic after ESLint + Prettier fixes.
// Compare with bad-code.js to see the improvements.
// ============================================================

// prefer-const: use const because x is never reassigned
const x = 5;

// eqeqeq: use === for strict equality
if (x === 5) {
  // no-console: this would still warn — intentionally kept for the demo
  console.log('x is 5');
}

// no-unused-vars: removed unusedVariable

// prefer-template: use template literal instead of concatenation
const name = 'World';
const greeting = `Hello, ${name}!`;

// object-shorthand: use shorthand property syntax
const age = 30;
const person = { name, age };

// arrow-body-style: remove braces when the body is a single expression
const double = (n) => n * 2;

// Prettier wraps long strings across lines (at 80 chars)
const message =
  'This is a very long string that exceeds the 80 character print width limit set in Prettier config';

console.log(greeting, person, double(x), message);
