# Chapter 2: Control Flow and Functions

## Overview

Control flow is the order in which the computer executes statements in a script. By default, code runs top-to-bottom, one line at a time. **Conditionals** let you branch execution based on conditions, **loops** let you repeat code, and **functions** let you package reusable logic. Together these three pillars allow you to write dynamic, DRY, and maintainable programs.

This chapter also covers **scope**, **hoisting**, and **closures** — three of the most important (and most misunderstood) concepts in JavaScript.

## Learning Objectives

By the end of this chapter you will be able to:
- Write conditional logic using `if / else if / else` and `switch`
- Use all loop constructs (`for`, `while`, `do-while`, `for...of`, `for...in`) and know when to choose each
- Declare functions using declarations, expressions, and arrow syntax
- Understand function parameters, default values, rest parameters, and the spread operator
- Explain what scope is and identify the scope of any variable
- Describe how hoisting works for both variables and function declarations
- Understand closures and write practical examples that use them

---

## 1. Conditionals

Conditionals let a program make decisions by executing different blocks of code depending on whether an expression evaluates to `true` or `false`.

### 1.1 `if`, `else if`, `else`

The basic building block of branching logic.

```js
const temperature = 28;

if (temperature > 35) {
  console.log("It's very hot outside.");
} else if (temperature > 20) {
  console.log("It's a pleasant day.");
} else if (temperature > 10) {
  console.log("It's a bit cool.");
} else {
  console.log("It's cold — grab a jacket!");
}
// Output: "It's a pleasant day."
```

**Rules:**
- The condition inside `if (...)` is coerced to a boolean. Values that coerce to `false` are called **falsy**: `false`, `0`, `""`, `null`, `undefined`, `NaN`.
- Everything else is **truthy**.
- Only the **first** matching branch executes; the rest are skipped.

#### Truthy / Falsy Quick Reference

```js
// Falsy values
if (0)         { /* never runs */ }
if ("")        { /* never runs */ }
if (null)      { /* never runs */ }
if (undefined) { /* never runs */ }
if (NaN)       { /* never runs */ }
if (false)     { /* never runs */ }

// Truthy values (everything else)
if (1)         { console.log("truthy"); }  // runs
if ("hello")   { console.log("truthy"); }  // runs
if ([])        { console.log("truthy"); }  // runs — empty array is truthy!
if ({})        { console.log("truthy"); }  // runs — empty object is truthy!
```

### 1.2 The Ternary Operator

A compact one-liner version of `if / else`, useful for simple assignments.

```js
const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"
```

> **Tip:** Only use ternary for simple, readable cases. Avoid nesting ternaries — they become hard to read quickly.

### 1.3 `switch`

`switch` compares an expression against multiple **cases** using strict equality (`===`). It is a cleaner alternative to a long `if / else if` chain when comparing a single value.

```js
const day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday — time to work!");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend — time to rest!");
    break;
  default:
    console.log("Unknown day.");
}
// Output: "Weekday — time to work!"
```

**Key details:**
- **`break`** exits the switch block. Without it, execution **falls through** to the next case — this is often a bug.
- **`default`** is optional and acts like an `else` — it runs when no case matches.
- Cases are compared with `===`, so `switch ("3")` does **not** match `case 3`.

#### Intentional Fall-Through

```js
const grade = "B";

switch (grade) {
  case "A":
  case "B":
    console.log("Great job!"); // runs for both A and B
    break;
  case "C":
    console.log("Average.");
    break;
  default:
    console.log("Needs improvement.");
}
```

### 1.4 Short-Circuit Evaluation

Logical operators `&&` and `||` can act as conditionals themselves:

```js
// && — runs right side only if left is truthy
const user = { name: "Alice" };
user && console.log(user.name); // "Alice"

// || — returns first truthy value (great for defaults)
const username = "" || "Guest";
console.log(username); // "Guest"

// ?? (Nullish Coalescing) — only falls back for null/undefined
const count = 0 ?? 42;
console.log(count); // 0  (because 0 is not null/undefined)
```

---

## 2. Loops

Loops allow you to execute a block of code repeatedly. JavaScript has five main loop constructs.

### 2.1 `for` Loop

The classic loop with full control over the counter variable. Best used when you know the number of iterations in advance.

```js
// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// 1, 2, 3, 4, 5

// Iterate over an array by index
const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}
// 0 "apple"
// 1 "banana"
// 2 "cherry"
```

The `for` statement has three parts: `for (initializer; condition; afterthought)`.

| Part | Example | Purpose |
|---|---|---|
| Initializer | `let i = 0` | Runs once before the loop starts |
| Condition | `i < 5` | Checked before every iteration; loop stops when `false` |
| Afterthought | `i++` | Runs after every iteration |

### 2.2 `while` Loop

Runs as long as the condition is `true`. Best when you don't know the number of iterations in advance.

```js
let count = 0;

while (count < 3) {
  console.log("count is", count);
  count++;
}
// count is 0
// count is 1
// count is 2
```

> **Warning:** Always ensure the condition will eventually become `false`, otherwise you get an infinite loop that freezes the browser/process.

### 2.3 `do...while` Loop

Like `while`, but the body executes **at least once** before checking the condition.

```js
let input;

do {
  input = prompt("Enter a number greater than 10:");
  input = Number(input);
} while (input <= 10);

console.log("You entered:", input);
```

This is commonly used for "try at least once" patterns like user input validation.

### 2.4 `for...of` Loop

Iterates over the **values** of any iterable object (arrays, strings, Sets, Maps, etc.). This is the modern, preferred way to loop over array items.

```js
const colors = ["red", "green", "blue"];

for (const color of colors) {
  console.log(color);
}
// red
// green
// blue

// Works on strings too!
for (const char of "hello") {
  console.log(char);
}
// h, e, l, l, o
```

> **Note:** `for...of` gives you the **value**, not the index. Use `entries()` if you need both:

```js
for (const [index, value] of colors.entries()) {
  console.log(index, value);
}
// 0 "red"
// 1 "green"
// 2 "blue"
```

### 2.5 `for...in` Loop

Iterates over the **enumerable property keys** of an object. Do not use it to iterate arrays (use `for...of` instead).

```js
const person = { name: "Alice", age: 30, city: "Bucharest" };

for (const key in person) {
  console.log(key, ":", person[key]);
}
// name : Alice
// age : 30
// city : Bucharest
```

> **Caution:** `for...in` also iterates inherited properties. Use `Object.hasOwn(obj, key)` (or `obj.hasOwnProperty(key)`) to guard against this:

```js
for (const key in person) {
  if (Object.hasOwn(person, key)) {
    console.log(key, person[key]);
  }
}
```

### 2.6 `break` and `continue`

- **`break`** — exits the loop immediately.
- **`continue`** — skips the rest of the current iteration and moves to the next.

```js
// break: stop at 5
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// continue: skip even numbers
for (let i = 0; i < 8; i++) {
  if (i % 2 === 0) continue;
  console.log(i); // 1, 3, 5, 7
}
```

### 2.7 Loop Comparison

| Loop | Use when |
|---|---|
| `for` | Known number of iterations, or need the index |
| `while` | Condition-based, unknown iterations |
| `do...while` | Must execute at least once |
| `for...of` | Iterating values of arrays / iterables |
| `for...in` | Iterating keys of plain objects |

---

## 3. Functions

A **function** is a reusable block of code designed to perform a specific task. Functions are one of JavaScript's most fundamental building blocks.

### 3.1 Function Declaration

A named function defined with the `function` keyword.

```js
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet("Bob"));   // "Hello, Bob!"
```

**Key features:**
- Hoisted to the top of its scope (can be called before it is defined in the code).
- Has its own `arguments` object.

### 3.2 Function Expression

A function assigned to a variable. The variable holds a reference to the function.

```js
const add = function (a, b) {
  return a + b;
};

console.log(add(3, 4)); // 7
```

- **Not hoisted** in the same way — the variable is hoisted, but its value (the function) is not.
- Can be anonymous (no name after `function`) or named (for better stack traces).

```js
// Named function expression — useful for recursion and debugging
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
console.log(factorial(5)); // 120
```

### 3.3 Arrow Functions

Introduced in ES6, arrow functions provide a shorter syntax and do **not** have their own `this`, `arguments`, or `super`.

```js
// Single parameter — parentheses optional
const double = n => n * 2;

// Multiple parameters
const multiply = (a, b) => a * b;

// No parameters
const greetWorld = () => "Hello, World!";

// Multi-line body — needs curly braces and explicit return
const greetUser = (name) => {
  const message = "Hello, " + name + "!";
  return message;
};

console.log(double(5));         // 10
console.log(multiply(3, 4));    // 12
console.log(greetWorld());      // "Hello, World!"
console.log(greetUser("Alice")); // "Hello, Alice!"
```

> **When to use:** Arrow functions are ideal for callbacks and short utilities. Avoid them for methods on objects or constructors (because they lack their own `this`).

| Feature | Function Declaration | Function Expression | Arrow Function |
|---|---|---|---|
| Hoisted | ✅ Yes | ❌ No | ❌ No |
| Own `this` | ✅ Yes | ✅ Yes | ❌ No (inherits) |
| `arguments` object | ✅ Yes | ✅ Yes | ❌ No |
| Can be constructor | ✅ Yes | ✅ Yes | ❌ No |
| Syntax length | Medium | Medium | Short |

### 3.4 Parameters and `return`

Functions receive input through **parameters** (the names in the definition) and send output back with **`return`**.

```js
function subtract(a, b) {  // a, b are parameters
  return a - b;             // sends the result back to the caller
}

const result = subtract(10, 4);  // 10, 4 are arguments
console.log(result); // 6
```

- A function without an explicit `return` statement returns `undefined`.
- `return` also **exits** the function immediately.

```js
function findFirst(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // exits immediately when found
    }
  }
  return -1; // only reached if not found
}

console.log(findFirst([10, 20, 30], 20)); // 1
console.log(findFirst([10, 20, 30], 99)); // -1
```

### 3.5 Default Parameters

Provide a fallback value for a parameter when the caller doesn't pass one (or passes `undefined`).

```js
function greet(name = "stranger", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet());                   // "Hello, stranger!"
console.log(greet("Alice"));            // "Hello, Alice!"
console.log(greet("Bob", "Good morning")); // "Good morning, Bob!"
```

> **Note:** Default parameters only activate when the argument is `undefined`, not `null`.

### 3.6 Rest Parameters

The **rest parameter** (`...args`) collects any number of arguments into an array. It must be the **last** parameter.

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));          // 6
console.log(sum(10, 20, 30, 40));   // 100
console.log(sum());                  // 0
```

Combining named and rest parameters:

```js
function logMessage(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}

logMessage("INFO", "Server started", "on port 3000");
// [INFO] Server started on port 3000
```

### 3.7 Spread Operator

The **spread operator** (`...`) expands an iterable (array, string, etc.) into individual elements. It is the "opposite" of rest in terms of direction (rest **collects**, spread **expands**).

```js
// Spread in function calls
const nums = [3, 1, 4, 1, 5, 9];
console.log(Math.max(...nums));  // 9  (same as Math.max(3, 1, 4, 1, 5, 9))

// Spread to copy / merge arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Spread to copy / merge objects
const defaults = { theme: "light", fontSize: 14 };
const userPrefs = { fontSize: 16, language: "en" };
const settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: "light", fontSize: 16, language: "en" }
```

### 3.8 Higher-Order Functions

A **higher-order function** is a function that accepts another function as an argument or returns a function. This is a core concept in functional programming and is used heavily in JavaScript.

```js
// Array.map — applies a function to each element and returns a new array
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(n => n * n);
console.log(squared); // [1, 4, 9, 16, 25]

// Array.filter — returns elements that pass a test
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// Array.reduce — accumulates values into a single result
const total = numbers.reduce((acc, n) => acc + n, 0);
console.log(total); // 15

// A function that returns another function
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const triple = multiplier(3);
console.log(triple(5));  // 15
console.log(triple(10)); // 30
```

---

## 4. Scope

**Scope** determines where a variable is accessible in your code. Understanding scope is essential for avoiding bugs and writing predictable programs.

### 4.1 Types of Scope

JavaScript has three main scope levels:

| Scope | Description | Created by |
|---|---|---|
| **Global** | Accessible everywhere | Variables declared outside any block/function |
| **Function** | Accessible only inside the function | `function` keyword |
| **Block** | Accessible only inside `{}` | `let` and `const` |

```js
// Global scope
const globalVar = "I am global";

function outer() {
  // Function scope
  const functionVar = "I am in outer()";

  if (true) {
    // Block scope
    const blockVar = "I am in the if block";
    let alsoBlock = "also block-scoped";
    var functionScoped = "I am function-scoped (NOT block-scoped)"; // var leaks!

    console.log(globalVar);   // ✅ accessible
    console.log(functionVar); // ✅ accessible
    console.log(blockVar);    // ✅ accessible
  }

  console.log(globalVar);    // ✅ accessible
  console.log(functionVar);  // ✅ accessible
  // console.log(blockVar);  // ❌ ReferenceError: blockVar is not defined
  console.log(functionScoped); // ✅ var leaks out of the block!
}

outer();
// console.log(functionVar); // ❌ ReferenceError
```

> **Rule of thumb:** Prefer `const` by default; use `let` when you need to reassign; avoid `var` in modern code.

### 4.2 The Scope Chain

When JavaScript looks up a variable, it starts in the current scope and works **outward** until it reaches the global scope. This is called the **scope chain**.

```js
const x = "global";

function outer() {
  const x = "outer";

  function inner() {
    const x = "inner";
    console.log(x); // "inner" — found in local scope first
  }

  function middle() {
    // No local x — walks up the chain
    console.log(x); // "outer" — found in outer()'s scope
  }

  inner();  // "inner"
  middle(); // "outer"
}

outer();
console.log(x); // "global"
```

### 4.3 Lexical Scope

JavaScript uses **lexical (static) scope**: a function's scope is determined by **where it is defined** in the source code, not where it is called from.

```js
const value = "defined in global";

function readValue() {
  console.log(value); // always reads global, because that's where it was defined
}

function callFromDifferentContext() {
  const value = "defined locally"; // local — does NOT affect readValue
  readValue(); // still prints "defined in global"
}

callFromDifferentContext(); // "defined in global"
```

---

## 5. Hoisting

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope before execution. It is one of the most surprising aspects of JavaScript for beginners.

### 5.1 Function Hoisting

**Function declarations** are fully hoisted — both the name and the body. You can call them before they appear in the code.

```js
// Works — greet() is hoisted
console.log(greet("Alice")); // "Hello, Alice!"

function greet(name) {
  return "Hello, " + name + "!";
}
```

### 5.2 Variable Hoisting

**`var` declarations** are hoisted (the declaration, not the assignment), so they exist from the start of the function — but their value is `undefined` until the assignment line runs.

```js
console.log(myVar); // undefined (not ReferenceError — it's hoisted!)
var myVar = 42;
console.log(myVar); // 42
```

**`let` and `const`** are also technically hoisted, but they are in a **Temporal Dead Zone (TDZ)** from the start of the block until the declaration line. Accessing them before declaration throws a `ReferenceError`.

```js
console.log(myLet); // ❌ ReferenceError: Cannot access 'myLet' before initialization
let myLet = 10;
```

### 5.3 Hoisting Summary

| Declaration | Hoisted? | Initialized to | TDZ? |
|---|---|---|---|
| `function` declaration | ✅ Yes | Full body | ❌ No |
| `var` | ✅ Yes | `undefined` | ❌ No |
| `let` | ✅ Yes (technically) | Uninitialized | ✅ Yes |
| `const` | ✅ Yes (technically) | Uninitialized | ✅ Yes |
| Function expression (`const f = function() {}`) | ❌ body is not | — | ✅ Yes |

> **Best practice:** Always declare your variables and functions before using them, regardless of hoisting. It makes code easier to read and avoids confusion.

---

## 6. Closures

A **closure** is the combination of a function and the lexical environment (scope) in which it was defined. In practice: **a function that "remembers" the variables from the scope in which it was created**, even after that scope has finished executing.

### 6.1 Basic Closure

```js
function makeCounter() {
  let count = 0; // private to makeCounter's scope

  return function () {
    count++;       // inner function closes over `count`
    return count;
  };
}

const counter = makeCounter(); // makeCounter() has finished, but count lives on
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

const counter2 = makeCounter(); // fresh closure — its own `count`
console.log(counter2()); // 1
```

`count` is not accessible from outside — this is **data encapsulation**, one of the most powerful uses of closures.

### 6.2 Closures in Practice — Factory Functions

```js
function createMultiplier(factor) {
  return (number) => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const halve  = createMultiplier(0.5);

console.log(double(10)); // 20
console.log(triple(10)); // 30
console.log(halve(10));  // 5
```

### 6.3 Closures in Practice — Private State

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private — not accessible from outside

  return {
    deposit(amount) {
      balance += amount;
      console.log(`Deposited ${amount}. Balance: ${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log("Insufficient funds.");
        return;
      }
      balance -= amount;
      console.log(`Withdrew ${amount}. Balance: ${balance}`);
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(100);
account.deposit(50);   // Deposited 50. Balance: 150
account.withdraw(30);  // Withdrew 30. Balance: 120
console.log(account.getBalance()); // 120
// console.log(account.balance);   // undefined — balance is private!
```

### 6.4 The Classic `var` in Loop Closure Bug

This is one of the most frequently encountered closure-related bugs:

```js
// BUG — var is function-scoped, so all callbacks share the same i
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 3, 3, 3 — not 0, 1, 2!
  }, 100);
}

// FIX 1 — use let (block-scoped, creates a new i for each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2 ✅
  }, 100);
}

// FIX 2 — use an IIFE to create a new scope per iteration
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // 0, 1, 2 ✅
    }, 100);
  })(i);
}
```

### 6.5 IIFEs (Immediately Invoked Function Expressions)

An **IIFE** is a function that is defined and called immediately. It creates its own scope, which was the primary way to avoid polluting the global scope before ES modules.

```js
(function () {
  const secret = "I am private";
  console.log("IIFE ran:", secret);
})();

// console.log(secret); // ❌ ReferenceError — secret is not in global scope

// Arrow function IIFE
const result = (() => {
  const x = 10;
  const y = 20;
  return x + y;
})();

console.log(result); // 30
```

---

## Summary

| Concept | Key Points |
|---|---|
| **Conditionals** | `if/else if/else` for multi-path logic; `switch` for single-value matching; ternary for compact expressions |
| **Loops** | `for` (index-based), `while` (condition-based), `do-while` (run once minimum), `for...of` (array values), `for...in` (object keys) |
| **Functions** | Declaration (hoisted), expression (not hoisted), arrow (no own `this`); parameters, defaults, rest, spread |
| **Scope** | Global → Function → Block; `let`/`const` are block-scoped; `var` is function-scoped |
| **Hoisting** | Function declarations are fully hoisted; `var` is hoisted as `undefined`; `let`/`const` have TDZ |
| **Closures** | Inner functions remember outer scope variables; enable data privacy, factory functions, and stateful logic |

---

## Further Reading

- [MDN — Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [MDN — Loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)
- [MDN — Functions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [MDN — Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [javascript.info — Closure](https://javascript.info/closure)
- [javascript.info — The old "var"](https://javascript.info/var)
