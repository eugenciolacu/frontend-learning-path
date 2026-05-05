// src/bad-code.js
// ============================================================
// This file contains intentional linting and formatting issues.
// Run `npm run lint` to see ESLint report them.
// Run `npm run lint:fix` and `npm run format` to auto-fix them.
// ============================================================

// ESLint will flag: prefer-const (x is never reassigned)
var x = 5

// ESLint will flag: eqeqeq (use === instead of ==)
if (x == 5) {
console.log("x is 5")   // ESLint: no-console warn; Prettier: wrong indentation
}

// ESLint will flag: no-unused-vars
const unusedVariable = 'hello'

// ESLint will flag: prefer-template (use template literal)
const name = 'World'
const greeting = 'Hello, ' + name + '!'

// ESLint will flag: object-shorthand
const age = 30
const person = { name: name, age: age }

// ESLint will flag: arrow-body-style (unnecessary braces)
const double = (n) => { return n * 2 }

// Prettier will flag: inconsistent quotes, missing semicolons, long line
const message = "This is a very long string that exceeds the 80 character print width limit set in Prettier config"

console.log(greeting, person, double(x), message)
