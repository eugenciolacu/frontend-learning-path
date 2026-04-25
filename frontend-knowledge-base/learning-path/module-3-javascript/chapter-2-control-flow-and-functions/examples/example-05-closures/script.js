/**
 * Example 05 – Closures
 *
 * Demonstrates:
 *  - What a closure is (inner function retaining access to outer scope)
 *  - Closure-based private state (counter)
 *  - Closure bank account (encapsulated data)
 *  - Factory functions returning closures
 *  - The classic var-in-loop bug and fixes (let / IIFE)
 *  - IIFEs (Immediately Invoked Function Expressions)
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

// ─── 1. Closure Counter ───────────────────────────────────────────────────────
//
// makeCounter() creates a private `count` variable.
// The returned object exposes three methods, all of which close over `count`.
// There is NO way to access or modify `count` directly from outside.

function makeCounter(initialValue = 0) {
  let count = initialValue; // PRIVATE — not accessible outside

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    reset() {
      count = initialValue;
      return count;
    },
    getValue() {
      return count;
    },
  };
}

// Create a single counter instance for the interactive UI
const counter = makeCounter(0);

function updateCounterDisplay() {
  document.getElementById("counterDisplay").textContent = counter.getValue();
}

function increment() {
  counter.increment();
  updateCounterDisplay();
  print("counter.increment()", counter.getValue());
}

function decrement() {
  counter.decrement();
  updateCounterDisplay();
  print("counter.decrement()", counter.getValue());
}

function resetCounter() {
  counter.reset();
  updateCounterDisplay();
  print("counter.reset()     ", counter.getValue());
}

// ─── 2. Closure Bank Account ──────────────────────────────────────────────────
//
// The `balance` variable is encapsulated inside createBankAccount().
// External code can only interact with it via the returned methods.

function createBankAccount(initialBalance) {
  let balance = initialBalance; // PRIVATE

  return {
    deposit(amount) {
      if (amount <= 0) {
        return "❌ Amount must be positive";
      }
      balance += amount;
      return `✅ Deposited €${amount}. New balance: €${balance}`;
    },
    withdraw(amount) {
      if (amount <= 0) {
        return "❌ Amount must be positive";
      }
      if (amount > balance) {
        return `❌ Insufficient funds. Balance: €${balance}`;
      }
      balance -= amount;
      return `✅ Withdrew €${amount}. New balance: €${balance}`;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(100);

function updateBalanceDisplay() {
  document.getElementById("balanceDisplay").textContent =
    `Balance: €${account.getBalance()}`;
}

function doDeposit() {
  const amount = Number(document.getElementById("bankAmount").value);
  const msg = account.deposit(amount);
  updateBalanceDisplay();
  print(msg);
}

function doWithdraw() {
  const amount = Number(document.getElementById("bankAmount").value);
  const msg = account.withdraw(amount);
  updateBalanceDisplay();
  print(msg);
}

// ─── 3. Factory Functions ─────────────────────────────────────────────────────
//
// Each call to createMultiplier() creates a NEW closure with its own `factor`.

function createMultiplier(factor) {
  return (number) => number * factor;
}

function createGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}

function demoFactory() {
  print("── Factory Functions ──");

  const double = createMultiplier(2);
  const triple = createMultiplier(3);
  const halve  = createMultiplier(0.5);

  print("double(10)", double(10)); // 20
  print("triple(10)", triple(10)); // 30
  print("halve(10) ", halve(10));  // 5

  // Each closure has its own independent `factor`
  print("");
  print("Closures are independent — modifying one doesn't affect another:");
  print("double(7) ", double(7));  // 14
  print("triple(7) ", triple(7));  // 21

  print("");
  const sayHello = createGreeter("Hello");
  const sayHola  = createGreeter("Hola");

  print("sayHello('Alice')", sayHello("Alice"));
  print("sayHola('Bob')  ", sayHola("Bob"));

  print("");
}

// ─── 4. The var-in-Loop Bug & Fixes ──────────────────────────────────────────

function demoLoopBug() {
  print("── var-in-Loop Bug ──");
  print("var is function-scoped, so all callbacks share the SAME i");
  print("Expected: 0, 1, 2 — but all print 3!");
  print("");

  const results = [];

  for (var i = 0; i < 3; i++) {
    // setTimeout is async — by the time it runs, the loop is already done
    // and i has the final value (3)
    setTimeout(function () {
      results.push(i); // all push 3!
    }, 0);
  }

  // Show results after callbacks run
  setTimeout(function () {
    print("var loop results (after all timeouts)", results.join(", "));
    print("");
  }, 50);
}

function demoLoopFix() {
  print("── Fix 1: use let (block-scoped) ──");
  print("Each iteration gets its own `i` binding");

  const letResults = [];
  for (let i = 0; i < 3; i++) {
    setTimeout(function () {
      letResults.push(i); // each closure has its own i
    }, 0);
  }

  setTimeout(function () {
    print("let loop results ", letResults.join(", ")); // 0, 1, 2 ✅
    print("");

    print("── Fix 2: IIFE per iteration ──");
    print("Create a new scope explicitly using an IIFE");

    const iifeResults = [];
    for (var j = 0; j < 3; j++) {
      (function (captured) {
        // `captured` is a NEW variable local to this IIFE
        setTimeout(function () {
          iifeResults.push(captured);
        }, 0);
      })(j); // immediately pass the current value of j
    }

    setTimeout(function () {
      print("IIFE loop results", iifeResults.join(", ")); // 0, 1, 2 ✅
      print("");
    }, 50);
  }, 50);
}

// ─── 5. IIFE ──────────────────────────────────────────────────────────────────
//
// Immediately Invoked Function Expression:
//   (function() { ... })()   or   (() => { ... })()
//
// Creates a private scope immediately. Used to:
//  - Avoid polluting the global scope
//  - Create modules in pre-ESM code
//  - Run setup code that doesn't need to be reusable

function demoIIFE() {
  print("── IIFE ──");

  // Classic IIFE
  const classicResult = (function () {
    const privateData = "I live only inside the IIFE";
    return `IIFE ran and returned: "${privateData}"`;
  })();
  print("classicResult", classicResult);

  // Arrow function IIFE
  const arrowResult = (() => {
    const x = 10;
    const y = 20;
    return x + y;
  })();
  print("arrowResult  ", arrowResult); // 30

  // IIFE with parameter
  const greeted = (function (name) {
    return `Hello, ${name}! (from IIFE)`;
  })("World");
  print("greeted      ", greeted);

  // IIFE for initialization — runs once, result is stored
  const config = (() => {
    const isDev = false; // toggle for demo
    return {
      apiBase: isDev ? "http://localhost:3000" : "https://api.example.com",
      debug:   isDev,
      version: "1.0.0",
    };
  })();
  print("config       ", JSON.stringify(config));

  print("");
  print("Variables inside the IIFE are NOT accessible from outside:");
  try {
    print("privateData", typeof privateData === "undefined" ? "❌ undefined (not accessible)" : privateData);
  } catch (e) {
    print("privateData  ", `❌ ${e.message}`);
  }

  print("");
}

// ─── Run all ──────────────────────────────────────────────────────────────────

function runAll() {
  clearOutput();

  // 1. Counter
  print("=== 1. Closure Counter ===");
  const c = makeCounter(0);
  print("initial      ", c.getValue());
  print("increment x3 ", `${c.increment()}, ${c.increment()}, ${c.increment()}`);
  print("decrement    ", c.decrement());
  print("reset        ", c.reset());
  print("");

  // Separate counter — independent closure
  const c2 = makeCounter(10);
  print("c2 (starts at 10)", c2.getValue());
  print("c2.increment()", c2.increment());
  print("c1 is unchanged  ", c.getValue()); // still 0
  print("");

  // 2. Bank account
  print("=== 2. Bank Account ===");
  const acc = createBankAccount(100);
  print(acc.deposit(50));
  print(acc.withdraw(30));
  print(acc.withdraw(200));
  print("final balance", acc.getBalance());
  print("");

  // 3. Factory
  print("=== 3. Factory Functions ===");
  const triple = createMultiplier(3);
  [1, 5, 10].forEach(n => print(`triple(${n})`, triple(n)));
  print("");

  // 4. Loop closure (var bug)
  print("=== 4. Loop Closure ===");
  demoLoopBug();
  setTimeout(() => {
    demoLoopFix();
  }, 60);

  // 5. IIFE
  setTimeout(() => {
    print("=== 5. IIFE ===");
    demoIIFE();
  }, 200);
}
