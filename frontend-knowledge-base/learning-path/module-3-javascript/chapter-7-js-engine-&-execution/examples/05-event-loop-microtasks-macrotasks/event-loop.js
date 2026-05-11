/**
 * Example 05: Event Loop — Microtasks & Macrotasks
 *
 * Demonstrates:
 * - The order of execution: synchronous → microtasks → macrotasks
 * - How the entire microtask queue drains before any macrotask runs
 * - async/await as syntactic sugar over Promises (microtasks)
 * - How blocking the call stack freezes the UI
 * - How to yield control with setTimeout(fn, 0) for non-blocking work
 */

// ─── Scenario Definitions ─────────────────────────────────────────────────────

const scenarios = {

  /**
   * Basic scenario: demonstrates the fundamental execution order.
   * Sync code → microtasks → macrotask
   */
  basic: {
    code: `console.log("1 — sync");

setTimeout(() => {
  console.log("2 — macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("3 — microtask (Promise.then)");
});

queueMicrotask(() => {
  console.log("4 — microtask (queueMicrotask)");
});

console.log("5 — sync");

// Output order:
// 1 — sync
// 5 — sync
// 3 — microtask (Promise.then)
// 4 — microtask (queueMicrotask)
// 2 — macrotask (setTimeout 0ms)`,
    expected: [
      "1 — sync",
      "5 — sync",
      "3 — microtask (Promise.then)",
      "4 — microtask (queueMicrotask)",
      "2 — macrotask (setTimeout 0ms)",
    ],
    run(log) {
      log("1 — sync", "sync");
      // Schedule macrotask
      setTimeout(() => log("2 — macrotask (setTimeout 0ms)", "macro"), 0);
      // Schedule microtasks
      Promise.resolve().then(() => log("3 — microtask (Promise.then)", "micro"));
      queueMicrotask(() => log("4 — microtask (queueMicrotask)", "micro"));
      log("5 — sync", "sync");
    },
  },

  /**
   * Nested microtasks: microtasks generated during microtask processing
   * are also processed before any macrotask.
   */
  "nested-micro": {
    code: `Promise.resolve()
  .then(() => {
    console.log("Microtask 1");
    // This .then() adds ANOTHER microtask
    return Promise.resolve();
  })
  .then(() => {
    console.log("Microtask 2 (added by Microtask 1)");
  })
  .then(() => {
    console.log("Microtask 3");
  });

setTimeout(() => {
  console.log("Macrotask (setTimeout)");
}, 0);

console.log("Synchronous");

// Output:
// Synchronous
// Microtask 1
// Microtask 2 (added by Microtask 1)
// Microtask 3
// Macrotask (setTimeout)`,
    expected: [
      "Synchronous",
      "Microtask 1",
      "Microtask 2 (added by Microtask 1)",
      "Microtask 3",
      "Macrotask (setTimeout)",
    ],
    run(log) {
      Promise.resolve()
        .then(() => {
          log("Microtask 1", "micro");
          return Promise.resolve();
        })
        .then(() => {
          log("Microtask 2 (added by Microtask 1)", "micro");
        })
        .then(() => {
          log("Microtask 3", "micro");
        });

      setTimeout(() => log("Macrotask (setTimeout)", "macro"), 0);

      log("Synchronous", "sync");
    },
  },

  /**
   * async/await: shows that code before await is sync,
   * and continuation after await is a microtask.
   */
  "async-await": {
    code: `async function fetchData() {
  console.log("A — before await (sync inside async fn)");

  // 'await' suspends fetchData and schedules
  // the continuation as a microtask
  const result = await Promise.resolve("data");

  console.log("C — after await:", result); // microtask
}

console.log("1 — start");
fetchData(); // Runs sync until hitting 'await'
console.log("B — after fetchData() call (sync)");

// Output:
// 1 — start
// A — before await (sync inside async fn)
// B — after fetchData() call (sync)
// C — after await: data`,
    expected: [
      "1 — start",
      "A — before await (sync inside async fn)",
      "B — after fetchData() call (sync)",
      "C — after await: data",
    ],
    run(log) {
      async function fetchData() {
        log("A — before await (sync inside async fn)", "sync");
        const result = await Promise.resolve("data");
        log(`C — after await: ${result}`, "micro");
      }

      log("1 — start", "sync");
      fetchData();
      log("B — after fetchData() call (sync)", "sync");
    },
  },

  /**
   * Multiple timers: all setTimeout callbacks are macrotasks,
   * each processed one per event loop cycle.
   */
  "multi-timers": {
    code: `console.log("Start");

setTimeout(() => console.log("Timeout 1 (100ms)"), 100);
setTimeout(() => console.log("Timeout 2 (0ms)"), 0);
setTimeout(() => console.log("Timeout 3 (50ms)"), 50);

Promise.resolve()
  .then(() => console.log("Microtask A"))
  .then(() => console.log("Microtask B"));

console.log("End");

// Output:
// Start
// End
// Microtask A
// Microtask B
// Timeout 2 (0ms)   ← fired first (shortest delay)
// Timeout 3 (50ms)
// Timeout 1 (100ms)`,
    expected: [
      "Start",
      "End",
      "Microtask A",
      "Microtask B",
      "Timeout 2 (0ms)",
      "Timeout 3 (50ms)",
      "Timeout 1 (100ms)",
    ],
    run(log) {
      log("Start", "sync");

      setTimeout(() => log("Timeout 1 (100ms)", "macro"), 100);
      setTimeout(() => log("Timeout 2 (0ms)", "macro"), 0);
      setTimeout(() => log("Timeout 3 (50ms)", "macro"), 50);

      Promise.resolve()
        .then(() => log("Microtask A", "micro"))
        .then(() => log("Microtask B", "micro"));

      log("End", "sync");
    },
  },
};

// ─── UI: Scenario Runner ──────────────────────────────────────────────────────

const execLog = document.getElementById("exec-log");
const scenarioCode = document.getElementById("scenario-code");
const expectedPanel = document.getElementById("expected-panel");
const expectedOutput = document.getElementById("expected-output");

function clearLog() {
  execLog.innerHTML = '<div class="log-placeholder">Output will appear here...</div>';
  scenarioCode.textContent = "// Select a scenario above";
  expectedPanel.hidden = true;
}

function addLogEntry(text, type) {
  // Remove placeholder on first entry
  const placeholder = execLog.querySelector(".log-placeholder");
  if (placeholder) placeholder.remove();

  const div = document.createElement("div");
  div.className = `log-entry log-${type}`;

  const typeLabel = { sync: "[SYNC]", micro: "[MICRO]", macro: "[MACRO]", info: "[INFO]" };
  div.textContent = `${typeLabel[type] ?? ""} ${text}`;
  execLog.appendChild(div);
  execLog.scrollTop = execLog.scrollHeight;
}

// Wire scenario buttons
document.querySelectorAll("[data-scenario]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.scenario;
    const scenario = scenarios[key];
    if (!scenario) return;

    clearLog();
    scenarioCode.textContent = scenario.code;
    expectedOutput.textContent = scenario.expected.join("\n");
    expectedPanel.hidden = false;

    // Run the scenario
    scenario.run(addLogEntry);
  });
});

document.getElementById("btn-clear").addEventListener("click", clearLog);

// ─── Blocking Demo ────────────────────────────────────────────────────────────

// Keep a live counter to demonstrate UI freezing
let counterValue = 0;
const counterDisplay = document.getElementById("counter-display");
const blockingStatus = document.getElementById("blocking-status");

// Tick counter every 100ms
setInterval(() => {
  counterValue++;
  counterDisplay.textContent = counterValue;
}, 100);

/**
 * Blocking: runs a tight loop for 2 seconds.
 * The call stack is occupied → event loop cannot process timers → UI freezes.
 */
document.getElementById("btn-block").addEventListener("click", () => {
  blockingStatus.textContent = "⚠️ Blocking for 2 seconds... (counter should freeze)";
  blockingStatus.style.color = "#f87171";

  // Synchronous busy-wait — blocks the entire event loop
  const end = Date.now() + 2000;
  while (Date.now() < end) {
    // tight busy loop
  }

  blockingStatus.textContent = "✅ Done blocking. Counter resumes now.";
  blockingStatus.style.color = "#4ade80";
});

/**
 * Non-blocking: breaks work into small chunks using setTimeout(fn, 0).
 * Each chunk yields control back to the event loop,
 * allowing UI updates and other callbacks to run between chunks.
 */
document.getElementById("btn-nonblock").addEventListener("click", async () => {
  blockingStatus.textContent = "✅ Working in chunks (yielding to event loop each iteration)...";
  blockingStatus.style.color = "#38bdf8";

  const CHUNKS = 20;
  const WORK_PER_CHUNK_MS = 50; // 20 × 50ms = 1 second total

  for (let i = 0; i < CHUNKS; i++) {
    // Do a small chunk of work
    const end = Date.now() + WORK_PER_CHUNK_MS;
    while (Date.now() < end) { /* work */ }

    // Yield to the event loop — UI updates can happen here!
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  blockingStatus.textContent = "✅ Done! Counter kept running throughout — event loop was free.";
  blockingStatus.style.color = "#4ade80";
});

// ─── Console: Deeper Examples ─────────────────────────────────────────────────

console.group("🔄 Event Loop Deep Examples");

// Promise chaining execution order
console.log("--- Promise chaining order ---");

console.log("sync 1");

Promise.resolve()
  .then(() => {
    console.log("micro 1");
    return Promise.resolve(); // resolving a new Promise adds a microtask
  })
  .then(() => console.log("micro 2"))
  .then(() => console.log("micro 3"));

Promise.resolve()
  .then(() => console.log("micro 4"))
  .then(() => console.log("micro 5"));

console.log("sync 2");

// Actual output:
// sync 1, sync 2, micro 1, micro 4, micro 2, micro 5, micro 3
// Note: each .then() chain interleaves!

console.groupEnd();
