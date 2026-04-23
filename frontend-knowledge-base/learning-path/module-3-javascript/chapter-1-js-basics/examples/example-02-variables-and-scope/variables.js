/**
 * Example 02 – Variables and Scope
 *
 * Topics covered:
 *  - var: function-scoped, hoisted, re-declarable
 *  - let: block-scoped, TDZ, not re-declarable
 *  - const: block-scoped, must initialize, cannot rebind
 *  - Hoisting
 *  - Temporal Dead Zone (TDZ)
 *  - Scope chain (global → function → block)
 *  - Classic loop-scope gotcha (var vs let)
 */

// ─── Utility ──────────────────────────────────────────────────────────────────

function log(label, value) {
  const out = document.getElementById("output");
  const line = value !== undefined ? `${label}: ${JSON.stringify(value)}` : label;
  out.textContent += line + "\n";
  console.log(line);
}

function clearOutput() {
  document.getElementById("output").textContent = "";
}

function heading(text) {
  log(`\n── ${text} ──`);
}

// ─── var behaviour ────────────────────────────────────────────────────────────

function demoVar() {
  clearOutput();
  heading("var: function-scoped & hoisted");

  // 1. var is function-scoped (NOT block-scoped)
  if (true) {
    var blockVar = "I was declared inside an if-block";
  }
  // var leaks out of the block!
  log("blockVar accessible outside if-block", blockVar);

  // 2. var can be re-declared without errors
  var city = "Berlin";
  log("city (first declaration)", city);
  var city = "Paris";        // re-declaration — valid but confusing
  log("city (re-declared)", city);

  // 3. var in a function stays inside the function
  function scopedExample() {
    var insideFunction = "only inside";
    log("insideFunction (inside fn)", insideFunction);
  }
  scopedExample();
  try {
    log("insideFunction (outside fn)", insideFunction); // should throw
  } catch (e) {
    log("Accessing insideFunction outside fn throws", e.message);
  }

  // 4. var hoisting — declaration moves to top of function
  log("varBeforeDeclaration (hoisted)", varBeforeDeclaration); // undefined
  var varBeforeDeclaration = "assigned now";
  log("varBeforeDeclaration (after assignment)", varBeforeDeclaration);
}

// ─── let behaviour ────────────────────────────────────────────────────────────

function demoLet() {
  clearOutput();
  heading("let: block-scoped, no re-declaration");

  let counter = 0;
  log("counter initial", counter);

  counter = 10; // reassignment is fine
  log("counter after reassignment", counter);

  // let is block-scoped
  if (true) {
    let blockOnly = "I am block-scoped";
    log("blockOnly inside block", blockOnly);
  }
  try {
    log("blockOnly outside block", blockOnly); // ReferenceError
  } catch (e) {
    log("blockOnly outside block → ReferenceError", e.message);
  }

  // Re-declaration is NOT allowed with let (would be a SyntaxError at parse time)
  // Uncomment to see:
  // let counter = 99; // SyntaxError: Identifier 'counter' has already been declared

  heading("let in for-loop (each iteration has its own scope)");
  // Each iteration of a for-loop with 'let' creates a new binding
  const results = [];
  for (let i = 0; i < 3; i++) {
    results.push(() => i); // captures the current i
  }
  log("loop results with let", results.map(fn => fn())); // [0, 1, 2] ✅
}

// ─── const behaviour ─────────────────────────────────────────────────────────

function demoConst() {
  clearOutput();
  heading("const: cannot rebind, but objects are mutable");

  const MAX = 100;
  log("MAX", MAX);

  try {
    // MAX = 200; // would throw TypeError
    // Simulating with eval to keep the rest of the code running:
    eval("MAX = 200;");
  } catch (e) {
    log("Reassigning const → TypeError", e.message);
  }

  // const with objects — the OBJECT itself is mutable!
  const user = { name: "Alice", age: 25 };
  log("user (initial)", user);

  user.name = "Bob";   // ✅ mutating a property is allowed
  user.role = "admin"; // ✅ adding a new property is allowed
  log("user (after mutation)", user);

  try {
    eval("user = {}"); // ❌ rebinding the variable throws
  } catch (e) {
    log("Rebinding user → TypeError", e.message);
  }

  // const with arrays — same rule applies
  const colors = ["red", "green"];
  log("colors (initial)", colors);
  colors.push("blue"); // ✅ mutating the array is allowed
  log("colors (after push)", colors);

  // To truly freeze an object, use Object.freeze()
  const config = Object.freeze({ debug: false, version: "1.0" });
  config.debug = true; // silently ignored in non-strict mode (or throws in strict)
  log("config.debug after freeze attempt", config.debug); // still false
}

// ─── Hoisting ─────────────────────────────────────────────────────────────────

function demoHoisting() {
  clearOutput();
  heading("Hoisting: declarations moved to top of scope");

  // var declarations are hoisted (initialized as undefined)
  log("hoistedVar before declaration", hoistedVar); // undefined — no error!
  var hoistedVar = "defined";
  log("hoistedVar after declaration", hoistedVar);

  // Function declarations are fully hoisted (can be called before declaration)
  log("Result of hoistedFn() called before its definition", hoistedFn());

  function hoistedFn() {
    return "I am a fully hoisted function!";
  }

  // Function EXPRESSIONS are NOT fully hoisted (only the var is hoisted)
  try {
    log("notHoistedFn before assignment", notHoistedFn); // undefined
    notHoistedFn(); // TypeError: notHoistedFn is not a function
  } catch (e) {
    log("Calling function expression before assignment → TypeError", e.message);
  }
  var notHoistedFn = function () { return "function expression"; };
  log("notHoistedFn after assignment", notHoistedFn());
}

// ─── Temporal Dead Zone (TDZ) ─────────────────────────────────────────────────

function demoTDZ() {
  clearOutput();
  heading("Temporal Dead Zone (TDZ) — let and const");

  // let and const are hoisted but NOT initialized → TDZ
  // Accessing them before their declaration line throws a ReferenceError

  try {
    // This would throw because 'myLet' is in the TDZ:
    // log("myLet before declaration", myLet);
    // Simulating with eval:
    eval("log('myLet in TDZ', myLet)");
  } catch (e) {
    log("Accessing let in TDZ → ReferenceError", e.message);
  }

  let myLet = "now defined";
  log("myLet after declaration", myLet);

  try {
    eval("log('myConst in TDZ', myConst)");
  } catch (e) {
    log("Accessing const in TDZ → ReferenceError", e.message);
  }

  const myConst = "defined";
  log("myConst after declaration", myConst);

  log("\nKey insight: Both let and const are hoisted, but the TDZ");
  log("prevents access until the declaration line is reached.");
}

// ─── Scope Chain ──────────────────────────────────────────────────────────────

function demoScope() {
  clearOutput();
  heading("Scope Chain: inner scopes access outer variables");

  let globalLike = "outer (function scope)";

  function outerFn() {
    let outerVar = "I'm in outerFn";

    function innerFn() {
      let innerVar = "I'm in innerFn";

      // Inner scope can access all outer scopes
      log("innerFn sees globalLike", globalLike);
      log("innerFn sees outerVar", outerVar);
      log("innerFn sees innerVar", innerVar);
    }

    innerFn();

    // Outer scope cannot see inner variables
    try {
      eval("log('outerFn sees innerVar', innerVar)");
    } catch (e) {
      log("outerFn cannot see innerVar → ReferenceError", e.message);
    }
  }

  outerFn();

  // Variable shadowing — inner scope hides outer with same name
  heading("Variable Shadowing");
  let color = "blue";
  log("outer color", color);

  function shadowExample() {
    let color = "red"; // shadows the outer 'color'
    log("inner color (shadows outer)", color);
  }
  shadowExample();
  log("outer color after shadowExample", color); // unchanged
}

// ─── Classic Loop Scope Gotcha ────────────────────────────────────────────────

function demoLoopScope() {
  clearOutput();
  heading("Loop Scope: var vs let in closures");

  // PROBLEM with var:
  // All callbacks share the SAME 'i' variable because var is function-scoped.
  // By the time the callbacks run, i has already reached 3.
  const varResults = [];
  for (var i = 0; i < 3; i++) {
    varResults.push(function () { return i; });
  }
  log("var loop results (expected [0,1,2])", varResults.map(fn => fn()));
  // [3, 3, 3] — all closures see the same final value of i

  // SOLUTION 1: Use let (each iteration creates a new binding)
  const letResults = [];
  for (let j = 0; j < 3; j++) {
    letResults.push(function () { return j; });
  }
  log("let loop results (expected [0,1,2])", letResults.map(fn => fn()));
  // [0, 1, 2] ✅

  // SOLUTION 2: IIFE (Immediately Invoked Function Expression) — old pre-ES6 workaround
  const iifeFnResults = [];
  for (var k = 0; k < 3; k++) {
    iifeFnResults.push(
      (function (captured) {
        return function () { return captured; };
      })(k)
    );
  }
  log("IIFE loop results (expected [0,1,2])", iifeFnResults.map(fn => fn()));
  // [0, 1, 2] ✅ — captures k at the time of the IIFE call

  log("\nConclusion: Always prefer 'let' in loops to avoid closure bugs.");
}
