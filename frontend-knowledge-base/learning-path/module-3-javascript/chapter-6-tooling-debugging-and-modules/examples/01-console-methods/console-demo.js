// ============================================================
// console-demo.js — Demonstrates all major Console API methods
// Open this in a browser with DevTools (F12) open.
// ============================================================

// ----------------------------------------------------------
// console.log() — General purpose logging
// ----------------------------------------------------------
function demoLog() {
  console.log("Simple string message");
  console.log("Number:", 42, "Boolean:", true);

  const user = { name: "Alice", role: "developer", active: true };
  console.log("User object:", user);

  // Multiple values are printed side-by-side
  console.log([1, 2, 3], { a: 1 }, "mixed types");

  // CSS styling with %c placeholder
  console.log(
    "%cSuccess!",
    "color: #a6e3a1; font-size: 16px; font-weight: bold;"
  );
}

// ----------------------------------------------------------
// console.warn() — Highlighted warning (yellow in DevTools)
// ----------------------------------------------------------
function demoWarn() {
  console.warn("This is a warning message.");
  console.warn("Deprecated API used — consider switching to the new version.");

  function legacyMethod() {
    console.warn("legacyMethod() is deprecated. Use newMethod() instead.");
  }
  legacyMethod();
}

// ----------------------------------------------------------
// console.error() — Error message (red in DevTools)
// ----------------------------------------------------------
function demoError() {
  console.error("Something went wrong.");

  try {
    null.property; // This will throw a TypeError
  } catch (err) {
    console.error("Caught an error:", err.message);
    console.error("Full error object:", err);
  }
}

// ----------------------------------------------------------
// console.table() — Renders arrays of objects as a table
// ----------------------------------------------------------
function demoTable() {
  const employees = [
    { id: 1, name: "Alice", department: "Engineering", salary: 95000 },
    { id: 2, name: "Bob", department: "Design", salary: 80000 },
    { id: 3, name: "Carol", department: "Marketing", salary: 75000 },
    { id: 4, name: "Dave", department: "Engineering", salary: 100000 },
  ];

  console.log("Full table:");
  console.table(employees);

  console.log("Only name and department columns:");
  console.table(employees, ["name", "department"]);
}

// ----------------------------------------------------------
// console.group() / console.groupEnd()
// Logically groups related output — collapsible in DevTools
// ----------------------------------------------------------
function demoGroup() {
  console.group("Request: GET /api/users");
  console.log("Status: 200 OK");
  console.log("Duration: 142ms");

  console.group("Response body");
  console.log("Count: 3");
  console.log("Data:", [{ id: 1 }, { id: 2 }, { id: 3 }]);
  console.groupEnd(); // End 'Response body'

  console.groupEnd(); // End 'Request: GET /api/users'
}

// ----------------------------------------------------------
// console.groupCollapsed()
// Like group() but starts in collapsed state
// ----------------------------------------------------------
function demoGroupCollapsed() {
  console.log("Processing 3 items...");

  for (let i = 1; i <= 3; i++) {
    console.groupCollapsed(`Item #${i} details`);
    console.log("ID:", i);
    console.log("Value:", Math.round(Math.random() * 100));
    console.log("Status: processed");
    console.groupEnd();
  }

  console.log("Done.");
}

// ----------------------------------------------------------
// console.time() / console.timeEnd() / console.timeLog()
// Measures elapsed time between calls with the same label
// ----------------------------------------------------------
function demoTime() {
  console.time("sorting-benchmark");

  // Simulate a computation
  const arr = Array.from({ length: 200_000 }, () => Math.random());
  arr.sort((a, b) => a - b);

  console.timeLog("sorting-benchmark", "Sort complete");

  // Simulate more work
  const sum = arr.reduce((acc, n) => acc + n, 0);
  console.log("Sum:", sum.toFixed(2));

  console.timeEnd("sorting-benchmark"); // Prints total elapsed time
}

// ----------------------------------------------------------
// console.count() / console.countReset()
// Counts how many times it's called with a given label
// ----------------------------------------------------------
function demoCount() {
  const statuses = ["success", "error", "success", "success", "error", "success"];

  statuses.forEach((status) => {
    console.count(status);
  });

  // Reset the 'success' counter
  console.countReset("success");
  console.log("After reset — calling success once more:");
  console.count("success"); // Should print: success: 1
}

// ----------------------------------------------------------
// console.assert()
// Logs only when the condition is FALSE (like a lightweight assertion)
// ----------------------------------------------------------
function demoAssert() {
  const MAX_ITEMS = 10;
  const cartItems = 15;

  // This assertion FAILS because cartItems > MAX_ITEMS
  console.assert(
    cartItems <= MAX_ITEMS,
    `Cart exceeds limit! Got ${cartItems}, max is ${MAX_ITEMS}.`,
    { cartItems, MAX_ITEMS }
  );

  const username = "Alice";
  // This assertion PASSES — no output
  console.assert(username.length > 0, "Username must not be empty");
  console.log("If you see no assertion error above, username is valid.");
}

// ----------------------------------------------------------
// console.trace()
// Prints the call stack at the point it is called
// ----------------------------------------------------------
function demoTrace() {
  function alpha() {
    beta();
  }
  function beta() {
    gamma();
  }
  function gamma() {
    console.trace("Trace from gamma()");
  }

  alpha();
  // Output shows: gamma <- beta <- alpha <- demoTrace <- (click handler)
}

// ----------------------------------------------------------
// console.dir()
// Shows all enumerable properties of an object
// Especially useful for DOM elements
// ----------------------------------------------------------
function demoDir() {
  const btn = document.querySelector("button");

  console.log("console.log (shows HTML):");
  console.log(btn);

  console.log("console.dir (shows all properties):");
  console.dir(btn);

  // Also works for plain objects
  const obj = { a: 1, b: { c: 2, d: [3, 4] } };
  console.dir(obj);
}

// ----------------------------------------------------------
// Styled output with %c
// ----------------------------------------------------------
function demoStyled() {
  console.log(
    "%c[INFO]%c Application started successfully.",
    "background:#89b4fa; color:#1e1e2e; padding:2px 6px; border-radius:3px; font-weight:bold;",
    "color:#cdd6f4;"
  );

  console.log(
    "%c[WARN]%c Memory usage is high.",
    "background:#f9e2af; color:#1e1e2e; padding:2px 6px; border-radius:3px; font-weight:bold;",
    "color:#f9e2af;"
  );

  console.log(
    "%c[ERROR]%c Database connection failed.",
    "background:#f38ba8; color:#1e1e2e; padding:2px 6px; border-radius:3px; font-weight:bold;",
    "color:#f38ba8;"
  );
}
