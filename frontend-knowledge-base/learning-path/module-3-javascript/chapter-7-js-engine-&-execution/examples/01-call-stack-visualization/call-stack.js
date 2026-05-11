/**
 * Example 01: Call Stack Visualization
 *
 * Demonstrates:
 * - How functions push frames onto the call stack
 * - How returning a function pops its frame off the stack
 * - Safe recursion with a base case (factorial)
 * - Stack Overflow from infinite recursion (caught via try/catch)
 */

// ─── UI Helpers ──────────────────────────────────────────────────────────────

const stackVisual = document.getElementById("stack-visual");
const logEl = document.getElementById("log");
const codeDisplay = document.getElementById("code-display");

/** Simulated call stack (for visual purposes only) */
let simulatedStack = [];

function updateStackUI() {
  stackVisual.innerHTML = "";

  if (simulatedStack.length === 0) {
    stackVisual.innerHTML = '<div class="stack-empty">Stack is empty</div>';
    return;
  }

  // Render stack frames — the last item is the "top" visually
  simulatedStack.forEach((frame, index) => {
    const div = document.createElement("div");
    div.className = "stack-frame" + (index === simulatedStack.length - 1 ? " top" : "");
    div.textContent = frame;
    stackVisual.appendChild(div);
  });
}

function logEntry(text, type = "info") {
  const div = document.createElement("div");
  div.className = `log-entry log-${type}`;
  div.textContent = text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

function pushFrame(name) {
  simulatedStack.push(name);
  updateStackUI();
  logEntry(`▶ PUSH  ${name}`, "push");
}

function popFrame(name) {
  simulatedStack.pop();
  updateStackUI();
  logEntry(`◀ POP   ${name}`, "pop");
}

function clearLog() {
  logEl.innerHTML = "";
  simulatedStack = [];
  updateStackUI();
  codeDisplay.textContent = "// Click a button above to see the code";
}

// ─── Example 1: Simple Call Chain ────────────────────────────────────────────

function runSimpleExample() {
  clearLog();

  codeDisplay.textContent = `function greet(name) {
  return \`Hello, \${name}!\`;
}

function formatMessage(name) {
  const result = greet(name);
  return result.toUpperCase();
}

function main() {
  const message = formatMessage("Alice");
  console.log(message); // "HELLO, ALICE!"
}

main();`;

  logEntry("=== Simple Call Chain ===", "info");

  // Simulate the call stack manually for visual demonstration
  setTimeout(() => {
    pushFrame("main()");

    setTimeout(() => {
      pushFrame("formatMessage('Alice')");

      setTimeout(() => {
        pushFrame("greet('Alice')");

        setTimeout(() => {
          // greet returns
          const greetResult = greetFn("Alice");
          logEntry(`  greet returned: "${greetResult}"`, "info");
          popFrame("greet('Alice')");

          setTimeout(() => {
            // formatMessage returns
            const formatted = greetResult.toUpperCase();
            logEntry(`  formatMessage returned: "${formatted}"`, "info");
            popFrame("formatMessage('Alice')");

            setTimeout(() => {
              // console.log
              pushFrame("console.log(...)");
              logEntry(`  Output: "${formatted}"`, "info");

              setTimeout(() => {
                popFrame("console.log(...)");
                popFrame("main()");
                logEntry("Stack is now empty ✅", "info");
              }, 600);
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    }, 400);
  }, 100);
}

function greetFn(name) {
  return `Hello, ${name}!`;
}

// ─── Example 2: Safe Recursion (Factorial) ───────────────────────────────────

function runRecursiveExample() {
  clearLog();

  codeDisplay.textContent = `function factorial(n) {
  if (n <= 1) return 1;     // base case — stops recursion
  return n * factorial(n - 1);
}

factorial(5);
// factorial(5) → 5 * factorial(4)
//             → 5 * 4 * factorial(3)
//             → 5 * 4 * 3 * factorial(2)
//             → 5 * 4 * 3 * 2 * factorial(1)
//             → 5 * 4 * 3 * 2 * 1 = 120`;

  logEntry("=== Recursive Factorial(5) ===", "info");

  const calls = [
    "factorial(5)",
    "factorial(4)",
    "factorial(3)",
    "factorial(2)",
    "factorial(1)",
  ];

  let step = 0;

  // Push all frames
  const pushInterval = setInterval(() => {
    if (step < calls.length) {
      pushFrame(calls[step]);
      if (step === calls.length - 1) {
        logEntry("  Base case reached! n === 1 → returns 1", "info");
      }
      step++;
    } else {
      clearInterval(pushInterval);

      // Now pop all frames with return values
      const returns = [1, 2, 6, 24, 120];
      let popStep = calls.length - 1;

      const popInterval = setInterval(() => {
        if (popStep >= 0) {
          logEntry(`  ${calls[popStep]} returned: ${returns[calls.length - 1 - popStep]}`, "info");
          popFrame(calls[popStep]);
          popStep--;
        } else {
          clearInterval(popInterval);
          logEntry("factorial(5) = 120 ✅", "info");
          logEntry("Stack is now empty ✅", "info");
        }
      }, 600);
    }
  }, 600);
}

// ─── Example 3: Stack Overflow ───────────────────────────────────────────────

function runOverflowExample() {
  clearLog();

  codeDisplay.textContent = `// ⚠️ NEVER do this in real code!
function recurse() {
  recurse(); // no base case — calls itself forever
}

try {
  recurse();
} catch (error) {
  // RangeError: Maximum call stack size exceeded
  console.error(error.message);
}

// The actual stack fills up thousands of frames
// Here we simulate just 10 frames for visualization`;

  logEntry("=== Stack Overflow Demo ===", "info");
  logEntry("⚠️  Simulating infinite recursion (safely caught)...", "info");

  // Simulate growing stack
  const MAX_SHOWN = 10;
  let count = 0;

  const growInterval = setInterval(() => {
    if (count < MAX_SHOWN) {
      pushFrame(`recurse() [call #${count + 1}]`);
      count++;
    } else {
      clearInterval(growInterval);

      setTimeout(() => {
        // Simulate the error
        try {
          // This will actually throw a RangeError
          function infiniteRecurse() { infiniteRecurse(); }
          infiniteRecurse();
        } catch (e) {
          logEntry(`❌ ${e.constructor.name}: ${e.message}`, "error");
          logEntry("  The browser killed the stack to protect itself.", "error");
          logEntry("  Always include a base case in recursive functions!", "error");

          // Clear the simulated stack
          simulatedStack = [];
          updateStackUI();
        }
      }, 500);
    }
  }, 200);
}

// ─── Button Wiring ───────────────────────────────────────────────────────────

document.getElementById("btn-simple").addEventListener("click", runSimpleExample);
document.getElementById("btn-recursive").addEventListener("click", runRecursiveExample);
document.getElementById("btn-overflow").addEventListener("click", runOverflowExample);
document.getElementById("btn-clear").addEventListener("click", clearLog);

// Initial state
logEntry("Ready. Click a button to start a demo.", "info");
