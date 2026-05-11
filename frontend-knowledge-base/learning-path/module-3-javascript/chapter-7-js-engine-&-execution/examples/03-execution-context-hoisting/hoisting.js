/**
 * Example 03: Execution Context & Hoisting
 *
 * Demonstrates:
 * - var hoisting (initialized to undefined)
 * - let/const Temporal Dead Zone (TDZ)
 * - Function declaration hoisting (full body)
 * - Function expression / arrow function hoisting (only var declaration)
 * - var leaking out of blocks vs let/const block scoping
 * - Classic var-in-loop closure bug vs let fix
 */

// ─── Output Helper ────────────────────────────────────────────────────────────

function showOutput(id, lines) {
  const el = document.getElementById(id);
  if (el) el.textContent = lines.join("\n");
}

// ─── Example Runners ──────────────────────────────────────────────────────────

const examples = {

  /**
   * var hoisting: declaration is hoisted and initialized to undefined.
   * Accessing before assignment gives undefined, not ReferenceError.
   */
  "var-hoisting"() {
    const lines = [];

    // This is what the engine sees after hoisting:
    // var x = undefined; ← hoisted
    // console.log(x);    → undefined
    // x = 10;
    // console.log(x);    → 10

    (function () {
      /* hoisted: var x = undefined */
      lines.push(`console.log(x) before assignment: ${eval("var x; x")}`); // simulated

      // Actual equivalent:
      {
        // We use a scoped block to simulate fresh var
      }
    })();

    // Direct demonstration:
    const result1 = (() => {
      var output = [];
      // Simulate hoisted behavior:
      var x; // var is hoisted to undefined
      output.push(`Before assignment: x = ${x}`); // undefined
      x = 10;
      output.push(`After assignment: x = ${x}`); // 10
      return output;
    })();

    showOutput("out-var-hoisting", result1);
  },

  /**
   * let/const TDZ: variable exists in scope but is uninitialized.
   * Accessing before declaration → ReferenceError.
   */
  "let-tdz"() {
    const lines = [];
    try {
      // Accessing 'y' before its declaration — we use eval to avoid
      // static hoisting by the outer function scope
      const result = new Function(`
        try {
          console.log(y);
        } catch (e) {
          return e.constructor.name + ': ' + e.message;
        }
        let y = 20;
      `)();
      lines.push(`Accessing let before declaration: ${result ?? "(no result)"}`);
    } catch (e) {
      lines.push(`Error: ${e.message}`);
    }

    // After declaration: works fine
    let y = 20;
    lines.push(`After declaration: y = ${y}`);

    showOutput("out-let-tdz", lines);
  },

  /**
   * Function declaration hoisting: entire function body is hoisted.
   * The function can be called before its declaration in source code.
   */
  "fn-decl-hoisting"() {
    const lines = [];

    // Wrapped in IIFE to isolate scope
    const result = (function () {
      const out = [];

      // Called BEFORE the declaration — works because of hoisting!
      sayHello();

      function sayHello() {
        out.push("sayHello() called before declaration: Hello, World!");
      }

      // Also works after
      sayHello();
      out.push("sayHello() called after declaration: still works!");

      return out;
    })();

    showOutput("out-fn-decl-hoisting", result);
  },

  /**
   * Function expression hoisting: only the var declaration is hoisted
   * (as undefined). The function body is NOT hoisted.
   * Calling undefined() → TypeError.
   */
  "fn-expr-hoisting"() {
    const lines = [];

    const result = (function () {
      const out = [];

      // var greet is hoisted as undefined
      // greet() at this point → TypeError: greet is not a function
      try {
        // Simulate accessing before assignment:
        var greet; // hoisted state
        if (typeof greet !== "function") {
          throw new TypeError("greet is not a function");
        }
        greet();
      } catch (e) {
        out.push(`Before assignment: ${e.constructor.name}: ${e.message}`);
      }

      // Now assign the function
      greet = function () {
        out.push("greet() called after assignment: Hi!");
      };

      greet(); // Works now

      return out;
    })();

    showOutput("out-fn-expr-hoisting", result);
  },

  /**
   * Arrow functions with const follow the TDZ rule (like let/const).
   * They are NOT callable before their declaration.
   */
  "arrow-hoisting"() {
    const lines = [];

    // Arrow function assigned to const → TDZ applies
    try {
      // Simulate: const sayBye is in TDZ before its declaration line
      const testTDZ = new Function(`
        try {
          sayBye();
        } catch (e) {
          return e.constructor.name + ': ' + e.message;
        }
        const sayBye = () => 'Bye!';
      `)();
      lines.push(`Before const declaration: ${testTDZ ?? "(ran without error?)"}`);
    } catch (e) {
      lines.push(`Error: ${e.message}`);
    }

    // After declaration: works fine
    const sayBye = () => "Bye!";
    lines.push(`After declaration: sayBye() = "${sayBye()}"`);

    showOutput("out-arrow-hoisting", lines);
  },

  /**
   * var leaks out of blocks (if, for, while).
   * let/const are block-scoped — they stay inside {}.
   */
  "var-block-leak"() {
    const lines = [];

    // var inside if block — leaks!
    if (true) {
      var leaked = "I escaped the block!";
      let blocked = "I stay in the block";
      lines.push(`Inside block — var leaked: "${leaked}"`);
      lines.push(`Inside block — let blocked: "${blocked}"`);
    }

    lines.push(`Outside block — var leaked: "${leaked}"`); // accessible!

    try {
      // blocked is not accessible here
      // Accessing it would be a ReferenceError
      // We simulate it:
      if (typeof blocked === "undefined") {
        throw new ReferenceError("blocked is not defined");
      }
      lines.push(`Outside block — let blocked: "${blocked}"`);
    } catch (e) {
      lines.push(`Outside block — let blocked: ${e.constructor.name}: ${e.message}`);
    }

    showOutput("out-var-block-leak", lines);
  },
};

// ─── Wire Example Buttons ─────────────────────────────────────────────────────

document.querySelectorAll("[data-example]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.example;
    if (examples[key]) examples[key]();
  });
});

// ─── Loop Hoisting Demos ──────────────────────────────────────────────────────

/**
 * Classic bug: var in for loop creates ONE shared variable.
 * All closures capture the same 'i', which is 3 after the loop ends.
 */
document.getElementById("btn-var-loop").addEventListener("click", () => {
  const fnsVar = [];

  for (var i = 0; i < 3; i++) {
    fnsVar.push(function () {
      return i; // 'i' is shared — all closures see the final value
    });
  }

  // After loop: i === 3
  const results = fnsVar.map((fn) => fn());
  const el = document.getElementById("out-var-loop");
  el.textContent = [
    `var i after loop: ${i}`,
    `Results: [${results.join(", ")}]`,
    `Expected [0, 1, 2] but got [3, 3, 3] — classic var closure bug!`,
  ].join("\n");
  el.style.color = "#f87171";
});

/**
 * Fix: let in for loop creates a NEW binding for each iteration.
 * Each closure captures its own 'j'.
 */
document.getElementById("btn-let-loop").addEventListener("click", () => {
  const fnsLet = [];

  for (let j = 0; j < 3; j++) {
    fnsLet.push(function () {
      return j; // each iteration's 'j' is independent
    });
  }

  const results = fnsLet.map((fn) => fn());
  const el = document.getElementById("out-let-loop");
  el.textContent = [
    `Results: [${results.join(", ")}]`,
    `Correctly returns [0, 1, 2] — each iteration has its own 'j' ✅`,
  ].join("\n");
  el.style.color = "#4ade80";
});

// ─── Console Demonstrations ───────────────────────────────────────────────────

console.group("📋 Execution Context & Hoisting — Console Demo");

// Execution context creation order
console.log("Script starts → Global EC created");

function outerFn() {
  console.log("outerFn called → new Function EC created");

  function innerFn() {
    console.log("innerFn called → another new Function EC created");
    console.log("innerFn EC has scope chain: innerFn → outerFn → Global");
  }

  innerFn();
  console.log("innerFn returned → innerFn EC destroyed");
}

outerFn();
console.log("outerFn returned → outerFn EC destroyed");
console.log("Script ends → Global EC remains (until page closes)");

console.groupEnd();
