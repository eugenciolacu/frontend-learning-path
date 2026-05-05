// ============================================================
// debugging-demo.js — Practical debugging scenarios
//
// How to use:
//   1. Open index.html in a browser.
//   2. Open DevTools (F12) → Sources tab.
//   3. Navigate to this file in the file tree.
//   4. Click line numbers to set breakpoints.
//   5. Click the buttons on the page to trigger each scenario.
// ============================================================

// ----------------------------------------------------------
// Scenario 1: Shopping Cart Total Bug
//
// The bug: string concatenation instead of numeric addition
// because prices are stored as strings.
// Set a breakpoint inside calculateTotal() to inspect 'item.price'.
// ----------------------------------------------------------
function calculateTotal(items) {
  let total = 0;

  for (const item of items) {
    // Set a breakpoint on this line to inspect 'item' and 'total'
    // You will notice item.price is a string ("9.99") not a number
    total += item.price * item.quantity; // * coerces to number (works)
    // But: total += item.price + item.quantity would concatenate strings!
  }

  return total;
}

function runCartDemo() {
  // BUG: prices stored as strings — parseFloat() is needed if using '+'
  const cart = [
    { name: "Coffee Mug", price: "12.99", quantity: 2 },
    { name: "Notebook", price: "4.50", quantity: 3 },
    { name: "Pen Set", price: "7.00", quantity: 1 },
  ];

  // This works because * coerces strings to numbers
  const total = calculateTotal(cart);
  const outputEl = document.getElementById("cart-output");

  console.log("Cart items:", cart);
  console.log("Total:", total);

  outputEl.textContent = `Total: $${total.toFixed(2)}`;
  outputEl.style.color = "#a6e3a1";

  // Demonstrate the classic concatenation bug:
  let buggyTotal = 0;
  for (const item of cart) {
    // BUG: string + number = string concatenation, not addition
    buggyTotal = buggyTotal + item.price; // "012.994.507.00" not a number sum!
  }
  console.warn("Buggy total (string concat):", buggyTotal);
  console.log(
    "FIX: Use parseFloat(item.price) or store prices as numbers from the start."
  );
}

// ----------------------------------------------------------
// Scenario 2: Using the `debugger` statement
//
// When DevTools is open, execution pauses at `debugger`.
// Use Step Over (F10) to walk through the loop one iteration at a time.
// Watch the 'sum' and 'i' values change in the Scope panel.
// ----------------------------------------------------------
function runDebuggerDemo() {
  const numbers = [10, 20, 30, 40, 50];
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    debugger; // <-- Execution pauses here (only when DevTools is open)
    sum += numbers[i];
  }

  const outputEl = document.getElementById("debugger-output");
  outputEl.textContent = `Sum of [${numbers}] = ${sum}`;
  console.log("Final sum:", sum);
}

// ----------------------------------------------------------
// Scenario 3: Async / Fetch Debugging
//
// Simulates fetching from a public API.
// Use the Network tab to inspect the request/response.
// Use the Console to see logged data or error messages.
// Try XHR/Fetch breakpoints in DevTools → Sources → Event Listener Breakpoints
// ----------------------------------------------------------
async function runAsyncDemo() {
  const outputEl = document.getElementById("async-output");
  outputEl.textContent = "Fetching...";
  outputEl.style.color = "#f9e2af";

  // Public API that returns JSON placeholder data
  const url = "https://jsonplaceholder.typicode.com/todos/1";

  try {
    console.log("Sending GET request to:", url);

    const response = await fetch(url);

    // Set a breakpoint here to inspect the 'response' object
    console.log("Response status:", response.status, response.statusText);
    console.log("Response headers:", [...response.headers.entries()]);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Set a breakpoint here to inspect 'data' before rendering
    console.log("Parsed JSON data:", data);
    console.table([data]);

    outputEl.textContent = JSON.stringify(data, null, 2);
    outputEl.style.color = "#a6e3a1";
  } catch (err) {
    console.error("Fetch failed:", err.message);
    outputEl.textContent = `Error: ${err.message}`;
    outputEl.style.color = "#f38ba8";
  }
}

// ----------------------------------------------------------
// Scenario 4: Measuring Performance
//
// Uses console.time() and the Performance API.
// Open the Performance panel in DevTools → click Record → run this → Stop.
// ----------------------------------------------------------
function runPerfDemo() {
  const outputEl = document.getElementById("perf-output");
  outputEl.textContent = "Running...";

  // Mark the start using the Performance API
  performance.mark("sort-start");
  console.time("sort-500k-items");

  // Generate and sort 500,000 random numbers
  const size = 500_000;
  const arr = Array.from({ length: size }, () => Math.random());
  arr.sort((a, b) => a - b);

  console.timeEnd("sort-500k-items");
  performance.mark("sort-end");
  performance.measure("sort-duration", "sort-start", "sort-end");

  // Read the measurement
  const [measure] = performance.getEntriesByName("sort-duration");
  const duration = measure.duration.toFixed(2);

  console.log(`Sorted ${size.toLocaleString()} items in ${duration}ms`);
  console.log(
    "Verify in DevTools → Performance panel → Timings section"
  );

  outputEl.textContent = `Sorted ${size.toLocaleString()} items in ${duration}ms`;
  outputEl.style.color = "#a6e3a1";

  // Clean up performance marks
  performance.clearMarks();
  performance.clearMeasures();
}
