/**
 * Example 04: Scope Chain & Lexical Scoping
 *
 * Demonstrates:
 * - How JavaScript resolves variable names by traversing the scope chain
 * - Lexical scoping: scope is determined at code-write time, not call time
 * - Variable shadowing
 * - Closures as a natural consequence of scope chains
 * - Block scope vs function scope
 * - IIFE pattern for private scope
 */

// ─── Output Helper ────────────────────────────────────────────────────────────

function showOutput(id, lines) {
  const el = document.getElementById(id);
  if (el) el.textContent = Array.isArray(lines) ? lines.join("\n") : lines;
}

// ─── Example 1: Basic Scope Chain Traversal ───────────────────────────────────

document.getElementById("btn-basic-chain").addEventListener("click", () => {
  const out = [];

  const planet = "Earth";     // global scope

  function outer() {
    const country = "Portugal"; // outer() scope

    function inner() {
      const city = "Lisbon"; // inner() scope

      // Scope chain lookup:
      out.push(`city    (own scope):    "${city}"`);
      out.push(`country (outer scope):  "${country}"`);
      out.push(`planet  (global scope): "${planet}"`);
    }

    inner();

    // Trying to access inner's variable from outer → ReferenceError
    try {
      if (typeof city === "undefined") throw new ReferenceError("city is not defined");
    } catch (e) {
      out.push(`outer cannot access city: ${e.constructor.name}`);
    }
  }

  outer();
  showOutput("out-basic-chain", out);
});

// ─── Example 2: Lexical Scoping ───────────────────────────────────────────────

document.getElementById("btn-lexical").addEventListener("click", () => {
  const out = [];
  const x = "global";

  function outer() {
    const x = "outer"; // shadows global x

    function inner() {
      // Scope chain at DEFINITION TIME: inner → outer → global
      // Finds 'x' = "outer" in outer's scope first
      out.push(`inner() logs x: "${x}"`);
    }

    return inner; // return the function reference
  }

  const fn = outer(); // outer() runs, inner's scope chain is set
  fn(); // called from global, but scope is still lexically determined

  out.push(`\nEven though fn() is called from global context,`);
  out.push(`it logs "outer" because scope is lexical (set at definition).`);

  showOutput("out-lexical", out);
});

// ─── Example 3: Variable Shadowing ───────────────────────────────────────────

document.getElementById("btn-shadow").addEventListener("click", () => {
  const out = [];

  const name = "Global Alice";

  function greet() {
    const name = "Local Bob"; // shadows the global 'name'
    out.push(`Inside greet(): name = "${name}"  (inner 'name' shadows global)`);
  }

  greet();
  out.push(`Outside greet(): name = "${name}"  (global 'name' unchanged)`);
  out.push(`\nShadowing: inner variable with same name hides the outer one`);
  out.push(`within its scope. Outer variable is unaffected.`);

  showOutput("out-shadow", out);
});

// ─── Example 4: Closure ───────────────────────────────────────────────────────

document.getElementById("btn-closure").addEventListener("click", () => {
  const out = [];

  /**
   * makeCounter returns methods that close over the 'count' variable.
   * 'count' lives in makeCounter's scope, which is preserved via closure.
   * Even after makeCounter() returns, the returned object can still
   * read/write 'count' because it holds a reference to the scope.
   */
  function makeCounter(start = 0) {
    let count = start;

    return {
      increment() { count++; },
      decrement() { count--; },
      value()     { return count; },
      reset()     { count = start; },
    };
  }

  const counter = makeCounter(10);
  out.push(`Initial value: ${counter.value()}`);
  counter.increment();
  counter.increment();
  out.push(`After 2 increments: ${counter.value()}`);
  counter.decrement();
  out.push(`After 1 decrement: ${counter.value()}`);
  counter.reset();
  out.push(`After reset: ${counter.value()}`);

  out.push(`\nmakeCounter(10) returned. Its local 'count' variable is`);
  out.push(`still alive because the returned object closes over it.`);

  // Two independent counters — each has its own 'count' in its own closure
  const c1 = makeCounter(0);
  const c2 = makeCounter(100);
  c1.increment();
  c2.decrement();
  out.push(`\nTwo independent counters (own closure each):`);
  out.push(`c1.value() = ${c1.value()} (started at 0)`);
  out.push(`c2.value() = ${c2.value()} (started at 100)`);

  showOutput("out-closure", out);
});

// ─── Example 5: Block Scope vs Function Scope ─────────────────────────────────

document.getElementById("btn-block-scope").addEventListener("click", () => {
  const out = [];

  function scopeDemo() {
    var funcScoped = "function scope";
    let blockScoped = "outer block";

    {
      var funcScoped2 = "still function scope!"; // var ignores blocks
      let blockScoped = "inner block shadows";   // new binding, shadows outer
      const alsoBlock = "block const";

      out.push(`Inside inner block:`);
      out.push(`  let blockScoped = "${blockScoped}" (shadows outer)`);
      out.push(`  const alsoBlock = "${alsoBlock}"`);
      out.push(`  var funcScoped2 = "${funcScoped2}" (var leaks out)`);
    }

    out.push(`\nOutside inner block:`);
    out.push(`  var funcScoped2 = "${funcScoped2}" (var accessible — leaks from block!)`);
    out.push(`  let blockScoped = "${blockScoped}" (original, unaffected by inner shadow)`);

    try {
      if (typeof alsoBlock === "undefined") throw new ReferenceError("alsoBlock is not defined");
    } catch (e) {
      out.push(`  const alsoBlock: ${e.constructor.name} — block-scoped ✅`);
    }
  }

  scopeDemo();
  showOutput("out-block-scope", out);
});

// ─── Example 6: IIFE ─────────────────────────────────────────────────────────

document.getElementById("btn-iife").addEventListener("click", () => {
  const out = [];

  // IIFE: Immediately Invoked Function Expression
  // Creates a private scope — variables inside don't pollute global scope
  const result = (function () {
    const secret = "private-api-key-123"; // stays private
    const count = 42;
    const helpers = {
      double: (n) => n * 2,
      square: (n) => n * n,
    };

    out.push(`Inside IIFE:`);
    out.push(`  secret = "${secret}" (private)`);
    out.push(`  helpers.double(5) = ${helpers.double(5)}`);
    out.push(`  helpers.square(4) = ${helpers.square(4)}`);

    // Only expose what the outside world needs
    return { count, double: helpers.double };
  })();

  out.push(`\nOutside IIFE (result object):`);
  out.push(`  result.count = ${result.count}`);
  out.push(`  result.double(7) = ${result.double(7)}`);
  out.push(`  result.secret = ${result.secret} (not exposed)`);
  out.push(`  'secret' variable: not accessible in global scope ✅`);

  showOutput("out-iife", out);
});

// ─── Scope Lookup Trace ───────────────────────────────────────────────────────

// Define a simulated scope chain for the lookup demo
const scopeChain = [
  {
    name: "inner() scope",
    color: "scope-inner",
    variables: { city: "Lisbon", innerPrivate: 42 },
  },
  {
    name: "outer() scope",
    color: "scope-outer",
    variables: { country: "Portugal", outerConfig: true },
  },
  {
    name: "Global scope",
    color: "scope-global",
    variables: { planet: "Earth", Math: "[built-in]", console: "[built-in]" },
  },
];

document.getElementById("btn-lookup").addEventListener("click", () => {
  const varName = document.getElementById("var-lookup").value.trim();
  const traceEl = document.getElementById("lookup-trace");
  traceEl.innerHTML = "";

  if (!varName) return;

  function addStep(text, type) {
    const div = document.createElement("div");
    div.className = `trace-step trace-${type}`;
    div.textContent = text;
    traceEl.appendChild(div);
  }

  addStep(`Looking up: "${varName}"`, "search");

  let found = false;
  for (const scope of scopeChain) {
    if (varName in scope.variables) {
      addStep(`  ✓ Found in ${scope.name}: ${varName} = ${JSON.stringify(scope.variables[varName])}`, "found");
      found = true;
      break;
    } else {
      addStep(`  ✗ Not in ${scope.name} — moving up the chain...`, "miss");
    }
  }

  if (!found) {
    addStep(`  ❌ ReferenceError: "${varName}" is not defined`, "error");
  }
});

// Also allow Enter key on input
document.getElementById("var-lookup").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("btn-lookup").click();
});

// ─── Console: Scope chain concepts ───────────────────────────────────────────

console.group("🔗 Scope Chain Concepts");

const globalVar = "I am global";

function level1() {
  const l1Var = "level 1";

  function level2() {
    const l2Var = "level 2";

    function level3() {
      // Scope chain: level3 → level2 → level1 → global
      console.log("level3 can access:", globalVar, l1Var, l2Var);
      console.log("Scope chain depth: 4 levels");
    }

    level3();
    console.log("level2 can access:", globalVar, l1Var, l2Var);
  }

  level2();
  console.log("level1 can access:", globalVar, l1Var);
}

level1();
console.log("global can access:", globalVar);

console.groupEnd();
