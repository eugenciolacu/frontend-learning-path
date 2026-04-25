/**
 * Example 04 – Scope & Hoisting
 *
 * Demonstrates:
 *  - Global scope, function scope, block scope
 *  - The scope chain (inner → outer → global lookup)
 *  - Lexical scope (where a function is DEFINED, not called)
 *  - Hoisting for function declarations
 *  - Hoisting behavior of var (undefined) vs let/const (TDZ)
 *
 * Open DevTools (F12) → Console for additional output.
 * Note: Some TDZ demos use try/catch so the page doesn't crash.
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

// ─── Global variable (accessible everywhere in this file) ────────────────────
const GLOBAL_MESSAGE = "I am in the GLOBAL scope";

// ─── 1. Global vs Function vs Block Scope ────────────────────────────────────

function demoScope() {
  print("── Scope Types ──");
  print("Global", GLOBAL_MESSAGE);

  // Function scope
  function outerFn() {
    const functionVar = "I am in FUNCTION scope (outerFn)";

    if (true) {
      // Block scope (let/const are scoped to {})
      const blockConst = "I am in BLOCK scope (the if-block)";
      let blockLet = "also BLOCK scope";
      // var leaks out of the block — dangerous!
      var varLeaks = "I am declared with var — I LEAK out of the block";

      print("  Inside block — functionVar", functionVar);  // ✅ outer scope visible
      print("  Inside block — blockConst ", blockConst);   // ✅ block scope
    }

    print("  After block  — functionVar", functionVar);    // ✅
    print("  After block  — varLeaks   ", varLeaks);       // ✅ var leaked out!

    try {
      // blockConst is not accessible here
      print("blockConst outside block", blockConst);
    } catch (e) {
      print("  After block  — blockConst ", `❌ ReferenceError: ${e.message}`);
    }
  }

  outerFn();

  print("");
  print("Scope summary:");
  print("  const/let → Block-scoped (safe, predictable)");
  print("  var       → Function-scoped (leaks from blocks — avoid)");
  print("  global    → Accessible from everywhere (use sparingly)");
  print("");
}

// ─── 2. Scope Chain ───────────────────────────────────────────────────────────

function demoScopeChain() {
  print("── Scope Chain ──");

  const level = "outer";

  function outer() {
    const level = "in outer()";

    function inner() {
      // No `level` here — walks up the chain
      // Finds `level` in outer()'s scope
      print("  inner() sees level", level);
    }

    function innerWithOwn() {
      const level = "in innerWithOwn()";
      // Has its own `level` — stops chain walk here
      print("  innerWithOwn() sees level", level);
    }

    inner();         // "in outer()"
    innerWithOwn();  // "in innerWithOwn()"
  }

  outer();
  print("  global scope sees level", level); // "outer"

  print("");
  print("Lookup order: local → enclosing → global → ReferenceError");
  print("");
}

// ─── 3. Lexical Scope ─────────────────────────────────────────────────────────

function demoLexical() {
  print("── Lexical Scope ──");
  print("A function sees the scope where it was DEFINED, not where it is CALLED.");
  print("");

  const greeting = "Hello from the global scope";

  function readGreeting() {
    // This function was defined at the top level.
    // It always sees the global `greeting`.
    print("  readGreeting() sees", greeting);
  }

  function callFromInside() {
    // Even though we call readGreeting() from here,
    // it still sees its own definition scope (global).
    const greeting = "I am LOCAL to callFromInside — NOT seen by readGreeting!";
    print("  callFromInside local greeting", greeting);
    readGreeting(); // still prints the global greeting
  }

  readGreeting();    // "Hello from the global scope"
  callFromInside();  // prints local, then calls readGreeting → still global

  print("");
}

// ─── 4. Function Declaration Hoisting ────────────────────────────────────────

function demoFunctionHoisting() {
  print("── Function Declaration Hoisting ──");
  print("Function declarations are FULLY hoisted.");
  print("");

  // Called BEFORE the declaration below — this works because of hoisting!
  const result1 = hoistedAdd(3, 4);
  print("  hoistedAdd(3, 4) called BEFORE declaration", result1); // 7

  // Function declaration — hoisted to the top of the enclosing scope
  function hoistedAdd(a, b) {
    return a + b;
  }

  // Arrow function expressions are NOT hoisted
  try {
    // Would throw: Cannot access 'hoistedArrow' before initialization
    // hoistedArrow(1, 2);  // ← this line would crash
    print("  hoistedArrow → NOT hoisted (arrow expression skipped to avoid crash)");
  } catch (e) {
    print("  hoistedArrow →", `❌ ${e.message}`);
  }

  const hoistedArrow = (a, b) => a + b;
  print("  hoistedArrow(3, 4) called AFTER declaration", hoistedArrow(3, 4));

  print("");
}

// ─── 5. var Hoisting vs let/const TDZ ────────────────────────────────────────

function demoVarHoisting() {
  print("── var Hoisting ──");
  print("var is hoisted and initialized to undefined.");
  print("");

  // `varExample` is hoisted — accessible but undefined until assignment
  print("  varExample BEFORE assignment", varExample); // undefined (not error!)
  var varExample = "I was assigned here";
  print("  varExample AFTER assignment ", varExample);

  print("");
  print("── let / const Temporal Dead Zone (TDZ) ──");
  print("let/const are hoisted but NOT initialized — accessing them throws.");
  print("");

  // Simulating TDZ — we can't actually access `letExample` before its declaration
  // in this scope without crashing, so we demonstrate it in an isolated function.
  function tdzDemo() {
    try {
      // Accessing `letExample` here would throw ReferenceError
      const valueBeforeDeclaration = letExample;
      print("  letExample before declaration", valueBeforeDeclaration);
    } catch (e) {
      print("  letExample before declaration →", `❌ ReferenceError: ${e.message}`);
    }
    let letExample = "I exist now";
    print("  letExample after declaration ", letExample);
  }

  tdzDemo();

  print("");
  print("── Hoisting Summary ──");
  print("  function declaration → fully hoisted (name + body)");
  print("  var                  → hoisted as undefined");
  print("  let / const          → hoisted but in TDZ (no access before declaration)");
  print("  arrow / expression   → follows var/let/const rules of its variable");
  print("");
}

// ─── Run all ──────────────────────────────────────────────────────────────────

function runAll() {
  clearOutput();
  demoScope();
  demoScopeChain();
  demoLexical();
  demoFunctionHoisting();
  demoVarHoisting();
}
