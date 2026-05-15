// ============================================================
// Example 5: Closures — Core Concepts and Practical Applications
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// PART 1: Basic Closure — Remembering the Outer Scope
// ----------------------------------------------------------

function makeCounter(start = 0) {
  let count = start; // count lives in makeCounter's scope

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    reset()     { count = start; return count; },
    value()     { return count; }
  };
}

const counterA = makeCounter(10);
const counterB = makeCounter(0);

console.log(counterA.increment()); // 11
console.log(counterA.increment()); // 12
console.log(counterB.increment()); // 1  — independent closure
console.log(counterA.reset());     // 10

// ----------------------------------------------------------
// PART 2: Data Privacy / Encapsulation
// Closure-based private state — classic pre-ES2022 pattern.
// ----------------------------------------------------------

function createBankAccount(ownerName, initialBalance) {
  let balance = initialBalance; // private — not accessible from outside

  function validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }
  }

  return {
    get owner() { return ownerName; },
    deposit(amount) {
      validateAmount(amount);
      balance += amount;
      console.log(`Deposited $${amount}. Balance: $${balance}`);
    },
    withdraw(amount) {
      validateAmount(amount);
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      console.log(`Withdrew $${amount}. Balance: $${balance}`);
    },
    getBalance() { return balance; }
  };
}

const account = createBankAccount('Alice', 100);
account.deposit(50);     // "Deposited $50. Balance: $150"
account.withdraw(30);    // "Withdrew $30. Balance: $120"
console.log(account.getBalance()); // 120
// console.log(balance); // ReferenceError — truly private

// ----------------------------------------------------------
// PART 3: Function Factory — Specialized Functions from a Template
// ----------------------------------------------------------

function createValidator(rules) {
  // `rules` is captured in the closure
  return function validate(value) {
    const errors = [];
    for (const rule of rules) {
      const error = rule(value);
      if (error) errors.push(error);
    }
    return errors.length === 0
      ? { valid: true }
      : { valid: false, errors };
  };
}

const required  = (v) => !v ? 'Field is required' : null;
const minLen    = (n) => (v) => v.length < n ? `Min length is ${n}` : null;
const maxLen    = (n) => (v) => v.length > n ? `Max length is ${n}` : null;
const noSpaces  = (v) => /\s/.test(v) ? 'No spaces allowed' : null;

const validateUsername = createValidator([required, minLen(3), maxLen(20), noSpaces]);
const validateEmail    = createValidator([required, (v) => !v.includes('@') ? 'Invalid email' : null]);

console.log(validateUsername('al'));          // { valid: false, errors: ['Min length is 3'] }
console.log(validateUsername('alice123'));    // { valid: true }
console.log(validateEmail('not-an-email'));   // { valid: false, errors: ['Invalid email'] }

// ----------------------------------------------------------
// PART 4: Memoization — Caching Expensive Results
// ----------------------------------------------------------

function memoize(fn) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Fibonacci without memoization: O(2^n) time
function slowFib(n) {
  if (n <= 1) return n;
  return slowFib(n - 1) + slowFib(n - 2);
}

// Fibonacci with memoization: O(n) time
const fastFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return fastFib(n - 1) + fastFib(n - 2); // recursive calls also hit cache
});

console.time('slow fib(35)');
console.log(slowFib(35));
console.timeEnd('slow fib(35)');

console.time('fast fib(35)');
console.log(fastFib(35));
console.timeEnd('fast fib(35)');

// ----------------------------------------------------------
// PART 5: Closure Gotcha — Loop with var
// ----------------------------------------------------------

console.log('\n--- Loop closure gotcha ---');

// BUG: All log `3` because `var` is function-scoped, not block-scoped.
// By the time the callbacks run, the loop has finished and i === 3.
const buggyCallbacks = [];
for (var i = 0; i < 3; i++) {
  buggyCallbacks.push(function() { return i; });
}
console.log('var loop:', buggyCallbacks.map(fn => fn())); // [3, 3, 3]

// FIX 1: Use `let` — creates a new binding per iteration
const fixedCallbacks = [];
for (let j = 0; j < 3; j++) {
  fixedCallbacks.push(function() { return j; });
}
console.log('let loop:', fixedCallbacks.map(fn => fn())); // [0, 1, 2]

// FIX 2: IIFE — classic pre-ES6 approach (creates a new scope per iteration)
const iifeFixes = [];
for (var k = 0; k < 3; k++) {
  iifeFixes.push((function(captured) {
    return function() { return captured; };
  })(k));
}
console.log('IIFE loop:', iifeFixes.map(fn => fn())); // [0, 1, 2]

// ----------------------------------------------------------
// PART 6: Currying with Closures
// Transform f(a, b, c) into f(a)(b)(c)
// ----------------------------------------------------------

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args); // enough args — call the function
    }
    // Not enough args — return a function that expects the rest
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6
console.log(curriedAdd(1, 2, 3));   // 6

const add10 = curriedAdd(10);       // partial — waiting for b and c
const add10and5 = add10(5);         // partial — waiting for c
console.log(add10and5(3));          // 18
