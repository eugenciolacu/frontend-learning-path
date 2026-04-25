/**
 * Example 03 – Functions
 *
 * Demonstrates:
 *  - Function declaration, function expression, arrow function syntax
 *  - Parameters, return values, default parameters
 *  - Rest parameters (...args)
 *  - Spread operator (...)
 *  - Higher-order functions (map, filter, reduce)
 *  - Factory functions (functions that return functions)
 *
 * Open DevTools (F12) → Console for additional output.
 */

// ─── Helper ───────────────────────────────────────────────────────────────────

function print(label, value) {
  const output = document.getElementById("output");
  const line = value !== undefined ? `${label}: ${value}` : label;
  output.textContent += line + "\n";
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

// ─── 1. Three ways to define a function ──────────────────────────────────────

// FUNCTION DECLARATION
// Fully hoisted — can be called before this line in the file.
function greetDeclaration(name) {
  return `Hello from a declaration, ${name}!`;
}

// FUNCTION EXPRESSION
// The variable is hoisted (as undefined), but the function body is NOT.
// Calling `greetExpression` before this line would throw a TypeError.
const greetExpression = function (name) {
  return `Hello from an expression, ${name}!`;
};

// ARROW FUNCTION
// Concise syntax. Does NOT have its own `this`, `arguments`, or `super`.
const greetArrow = (name) => `Hello from an arrow, ${name}!`;

function demoSyntax() {
  const name = document.getElementById("greetName").value || "stranger";
  print("── Function Syntax Comparison ──");
  print("Declaration  ", greetDeclaration(name));
  print("Expression   ", greetExpression(name));
  print("Arrow        ", greetArrow(name));

  print("");
  print("── Arrow function variations ──");

  // No params
  const sayHi = () => "Hi!";
  print("No params    ", sayHi());

  // Single param (parentheses optional)
  const double = n => n * 2;
  print("Single param ", double(7));

  // Multi-line body (needs {} and explicit return)
  const buildMessage = (first, last) => {
    const fullName = `${first} ${last}`;
    return `Welcome, ${fullName}!`;
  };
  print("Multi-line   ", buildMessage("John", "Doe"));

  print("");
}

// ─── 2. Parameters, return, default values ───────────────────────────────────

// Early return pattern
function findIndex(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i; // exits immediately when found
  }
  return -1; // only reached if not found
}

// Default parameters
function power(base, exponent = 2) {
  return Math.pow(base, exponent);
}

function greetWithDefault(name = "stranger", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

function demoParams() {
  const a = Number(document.getElementById("numA").value);
  const b = Number(document.getElementById("numB").value);

  print("── Parameters & Return Values ──");
  print(`a = ${a}, b = ${b}`);
  print("a + b", a + b);
  print("a - b", a - b);
  print("a * b", a * b);
  print("a / b", b !== 0 ? a / b : "division by zero");

  print("");
  print("── Early return (findIndex) ──");
  const sample = [10, 20, a, 40, b];
  print("Array", sample.join(", "));
  print(`findIndex(array, ${a})`, findIndex(sample, a));
  print(`findIndex(array, 99)`, findIndex(sample, 99));

  print("");
  print("── Default parameters ──");
  print(`power(${a})        `, power(a));         // uses default exponent = 2
  print(`power(${a}, 3)     `, power(a, 3));
  print("greet()            ", greetWithDefault());
  print(`greet("${a}")      `, greetWithDefault(String(a)));
  print(`greet("${a}", "Hi")`, greetWithDefault(String(a), "Hi"));

  print("");
}

// ─── 3. Rest parameters & Spread ─────────────────────────────────────────────

function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

function logMessage(level, ...messages) {
  return `[${level}] ${messages.join(" ")}`;
}

function demoRestSpread() {
  print("── Rest Parameters ──");
  print("sum()          ", sum());
  print("sum(1, 2, 3)   ", sum(1, 2, 3));
  print("sum(5, 10, 15, 20)", sum(5, 10, 15, 20));
  print("logMessage     ", logMessage("INFO", "Server", "started", "on port 3000"));

  print("");
  print("── Spread Operator ──");

  // Spread into a function call
  const nums = [3, 1, 4, 1, 5, 9, 2, 6];
  print("nums           ", nums.join(", "));
  print("Math.max(…nums)", Math.max(...nums));
  print("Math.min(…nums)", Math.min(...nums));
  print("sum(…nums)     ", sum(...nums));

  // Spread to clone / merge arrays
  const arr1 = [1, 2, 3];
  const arr2 = [4, 5, 6];
  const merged = [...arr1, ...arr2];
  print("merged arrays  ", merged.join(", "));

  // Spread to clone / merge objects
  const defaults = { theme: "light", fontSize: 14 };
  const overrides = { fontSize: 18, language: "en" };
  const config = { ...defaults, ...overrides };
  print("merged objects ", JSON.stringify(config));

  print("");
}

// ─── 4. Higher-order functions ───────────────────────────────────────────────

function demoHigherOrder() {
  print("── Higher-Order Functions ──");

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  print("Original array ", numbers.join(", "));

  // map — transform each element
  const doubled = numbers.map(n => n * 2);
  print("map(n => n*2)  ", doubled.join(", "));

  // filter — keep elements matching a condition
  const evens = numbers.filter(n => n % 2 === 0);
  print("filter(evens)  ", evens.join(", "));

  // reduce — accumulate to a single value
  const total = numbers.reduce((acc, n) => acc + n, 0);
  print("reduce(sum)    ", total);

  print("");
  print("── Chaining higher-order functions ──");
  // Sum of squares of even numbers
  const result = numbers
    .filter(n => n % 2 === 0)   // [2, 4, 6, 8, 10]
    .map(n => n * n)             // [4, 16, 36, 64, 100]
    .reduce((acc, n) => acc + n, 0); // 220
  print("sum of squares of evens", result);

  print("");
  print("── Passing functions as arguments ──");
  const words = ["banana", "apple", "cherry", "date"];
  print("Original       ", words.join(", "));
  print("sorted A-Z     ", [...words].sort().join(", "));
  print("sorted by len  ", [...words].sort((a, b) => a.length - b.length).join(", "));

  print("");
}

// ─── 5. Factory functions (functions returning functions) ────────────────────

function createMultiplier(factor) {
  // Returns a new function that remembers `factor`
  return (number) => number * factor;
}

function createLogger(prefix) {
  return (msg) => `[${prefix}] ${msg}`;
}

function createAdder(x) {
  return (y) => x + y;
}

function demoFactory() {
  print("── Factory Functions ──");

  const double  = createMultiplier(2);
  const triple  = createMultiplier(3);
  const halve   = createMultiplier(0.5);

  print("double(10)  ", double(10));
  print("triple(10)  ", triple(10));
  print("halve(10)   ", halve(10));

  print("");
  const infoLog  = createLogger("INFO");
  const errorLog = createLogger("ERROR");
  print("infoLog     ", infoLog("Server started"));
  print("errorLog    ", errorLog("Connection refused"));

  print("");
  const add5  = createAdder(5);
  const add10 = createAdder(10);
  print("add5(3)     ", add5(3));
  print("add10(3)    ", add10(3));

  print("");
}

// ─── Run all ──────────────────────────────────────────────────────────────────

function runAllFunctions() {
  clearOutput();

  print("=== Syntax Comparison ===");
  print("Declaration", greetDeclaration("World"));
  print("Expression ", greetExpression("World"));
  print("Arrow      ", greetArrow("World"));
  print("");

  print("=== Default Params ===");
  print(greetWithDefault());
  print(greetWithDefault("Alice"));
  print(greetWithDefault("Alice", "Good morning"));
  print("");

  print("=== Rest & Spread ===");
  print("sum(1..5)  ", sum(1, 2, 3, 4, 5));
  const arr = [10, 3, 7, 1];
  print("max(…arr)  ", Math.max(...arr));
  print("merged arr ", [...[1, 2], ...[3, 4]].join(", "));
  print("");

  print("=== Higher-Order Functions ===");
  const nums = [1, 2, 3, 4, 5];
  print("map *2    ", nums.map(n => n * 2).join(", "));
  print("filter odd", nums.filter(n => n % 2 !== 0).join(", "));
  print("reduce sum", nums.reduce((a, n) => a + n, 0));
  print("");

  print("=== Factory Functions ===");
  const triple = createMultiplier(3);
  print("triple(7) ", triple(7));
  const add100 = createAdder(100);
  print("add100(42)", add100(42));
}
