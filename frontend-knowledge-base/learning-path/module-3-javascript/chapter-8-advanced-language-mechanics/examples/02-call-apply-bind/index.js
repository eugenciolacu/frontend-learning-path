// ============================================================
// Example 2: call, apply, and bind in Depth
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// call — explicit `this` + individual arguments
// ----------------------------------------------------------

function formatPrice(currency, decimals) {
  return `${currency}${this.amount.toFixed(decimals)}`;
}

const product = { amount: 19.9 };
const order   = { amount: 1234.5678 };

console.log(formatPrice.call(product, '$', 2));  // "$19.90"
console.log(formatPrice.call(order,   '€', 3));  // "€1234.568"

// ----------------------------------------------------------
// apply — same as call but takes an array of arguments
// Useful when args are already in an array.
// ----------------------------------------------------------

const stats = [4, 8, 15, 16, 23, 42];

// Math.max/min don't accept arrays directly
const max = Math.max.apply(null, stats); // 42
const min = Math.min.apply(null, stats); // 4
console.log(`Max: ${max}, Min: ${min}`);

// Modern equivalent with spread:
const max2 = Math.max(...stats); // 42

// apply for borrowing Array methods on array-like objects
function showArgs() {
  // `arguments` is array-like but not a real array
  const args = Array.prototype.slice.apply(arguments);
  console.log('args array:', args);
}
showArgs(1, 'two', true); // [1, 'two', true]

// ----------------------------------------------------------
// bind — returns a new permanently-bound function
// ----------------------------------------------------------

const logger = {
  prefix: '[LOG]',
  log(message) {
    console.log(`${this.prefix} ${message}`);
  }
};

// Save a bound reference — safe to extract and pass around
const log = logger.log.bind(logger);
log('Server started');  // "[LOG] Server started"

setTimeout(log.bind(null, 'After timeout'), 100); // "[LOG] After timeout"
// Note: bind(null) here does nothing since `this` is already bound to logger

// ----------------------------------------------------------
// Partial Application with bind
// Pre-fill some arguments while leaving others free.
// ----------------------------------------------------------

function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2); // `this` = null (not used), a = 2
const triple = multiply.bind(null, 3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(double(9));  // 18

// ----------------------------------------------------------
// Function borrowing with call
// Reuse methods from one object on another.
// ----------------------------------------------------------

const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };

// Borrow Array.prototype.map for an array-like object
const result = Array.prototype.map.call(arrayLike, (item) => item.toUpperCase());
console.log(result); // ['A', 'B', 'C']

// ----------------------------------------------------------
// Implementing our own simplified `bind`
// (educational — shows how bind works internally)
// ----------------------------------------------------------

Function.prototype.myBind = function(thisArg, ...outerArgs) {
  const originalFn = this;
  return function(...innerArgs) {
    return originalFn.apply(thisArg, [...outerArgs, ...innerArgs]);
  };
};

function greet(greeting, name) {
  return `${greeting}, ${name}! I'm ${this.role}.`;
}

const asAdmin = greet.myBind({ role: 'Admin' }, 'Hello');
console.log(asAdmin('Alice')); // "Hello, Alice! I'm Admin."
