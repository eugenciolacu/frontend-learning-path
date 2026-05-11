/**
 * Example 06: Memory Management & Memory Leaks
 *
 * Demonstrates:
 * - Accidental global variable leaks
 * - Forgotten event listener leaks and proper cleanup (including AbortController)
 * - Closures holding large scopes vs extracting only needed values
 * - Timers (setInterval) not cleared — and proper cleanup pattern
 * - Detached DOM nodes and how to free them
 * - Unbounded Map cache vs WeakMap for GC-friendly caching
 */

// ─── Helper ───────────────────────────────────────────────────────────────────

function showOutput(id, lines, color = "#4ade80") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = Array.isArray(lines) ? lines.join("\n") : lines;
  el.style.color = color;
}

// ─── Demo 1: Accidental Global Variables ─────────────────────────────────────

document.getElementById("btn-demo-global").addEventListener("click", () => {
  const out = [];

  // ❌ Leaking function — intentionally NOT using 'use strict' here for demo
  function leakingFn() {
    /* global */ leakyVar = "I am on window now!"; // eslint-disable-line no-undef
  }

  // ✅ Safe function
  function safeFn() {
    const safeVar = "properly scoped";
    out.push(`✅ safeVar inside safeFn: "${safeVar}"`);
    // safeVar is cleaned up when safeFn returns
  }

  leakingFn();
  out.push(`❌ After leakingFn(): window.leakyVar = "${window.leakyVar}"`);
  out.push(`   leakyVar is now a global — never garbage collected!`);

  safeFn();
  out.push(`   After safeFn() returns: safeVar is out of scope and GC-eligible.`);

  // Clean up for demo
  delete window.leakyVar;
  out.push(`\n💡 Fix: always use 'let', 'const', or 'var'`);
  out.push(`💡 Add "use strict"; to catch accidental globals as ReferenceErrors`);

  showOutput("out-global", out);
});

// ─── Demo 2: Event Listeners ──────────────────────────────────────────────────

let listenerCallCount = 0;
let currentHandler = null;
let abortController = null;

const listenerCounterEl = document.getElementById("listener-counter");

function updateListenerCounter() {
  listenerCounterEl.textContent = `Listener calls: ${listenerCallCount}`;
}

document.getElementById("btn-add-listener").addEventListener("click", () => {
  const out = [];

  if (currentHandler) {
    out.push("⚠️ A listener is already added. Remove first.");
    showOutput("out-listener", out, "#f59e0b");
    return;
  }

  // Create a dummy target element (we'll add listener to the button itself for demo)
  abortController = new AbortController();

  currentHandler = () => {
    listenerCallCount++;
    updateListenerCounter();
  };

  // Add listener to document for demo (simulates a component listening)
  document.addEventListener("keydown", currentHandler, {
    signal: abortController.signal,
  });

  out.push("✅ Event listener added (press any key to trigger it)");
  out.push("   Use 'Remove Element (Fixed)' to properly clean up");
  out.push("   Use 'Remove Element (Leak)' to simulate forgetting cleanup");
  showOutput("out-listener", out);
});

document.getElementById("btn-forget-listener").addEventListener("click", () => {
  const out = [];
  out.push("❌ Simulating: element removed WITHOUT removing listener.");
  out.push("   The listener (and its closure scope) stays in memory.");
  out.push("   Press a key — listener still fires even though element is 'gone'!");
  out.push(`   Current call count: ${listenerCallCount}`);
  // We intentionally do NOT call removeEventListener or abort controller here
  // (the listener keeps running via keydown)
  showOutput("out-listener", out, "#f87171");
});

document.getElementById("btn-fix-listener").addEventListener("click", () => {
  const out = [];

  if (!abortController) {
    out.push("ℹ️ No listener to remove. Add one first.");
    showOutput("out-listener", out, "#94a3b8");
    return;
  }

  // AbortController cleanly removes all listeners attached to its signal
  abortController.abort();
  abortController = null;
  currentHandler = null;

  out.push("✅ Fixed: AbortController.abort() removed the listener.");
  out.push("   Handler and its scope are now eligible for GC.");
  out.push(`   Total listener calls before cleanup: ${listenerCallCount}`);
  out.push("   Press a key — listener no longer fires.");
  showOutput("out-listener", out);
});

// ─── Demo 3: Closure Scope Size ───────────────────────────────────────────────

document.getElementById("btn-demo-closure").addEventListener("click", () => {
  const out = [];
  const SIZE = 100_000;

  // ❌ Closure holds entire large array
  function createLeakingQuery() {
    const largeData = new Array(SIZE).fill("payload");
    return function query() {
      return largeData[0]; // only needs first item, but holds ALL items
    };
  }

  // ✅ Closure holds only the needed value
  function createEfficientQuery() {
    const largeData = new Array(SIZE).fill("payload");
    const firstItem = largeData[0]; // extract only what's needed
    // largeData is no longer referenced after this function returns
    return function query() {
      return firstItem; // closure holds a single string, not 100K items
    };
  }

  const leakyQuery = createLeakingQuery();
  const efficientQuery = createEfficientQuery();

  out.push(`Both return the same value: "${leakyQuery()}" / "${efficientQuery()}"`);
  out.push(``);
  out.push(`❌ Leaking closure:`);
  out.push(`   Closure scope holds: Array[${SIZE}] (~${(SIZE * 8 / 1024).toFixed(0)} KB of strings)`);
  out.push(`   Even though only largeData[0] is ever used!`);
  out.push(``);
  out.push(`✅ Efficient closure:`);
  out.push(`   Closure scope holds: just the string "${efficientQuery()}"`);
  out.push(`   largeData Array is freed after createEfficientQuery() returns`);
  out.push(``);
  out.push(`💡 Rule: Extract only the data your closure needs from large scopes.`);

  showOutput("out-closure", out);
});

// ─── Demo 4: Timers Not Cleared ───────────────────────────────────────────────

let intervalId = null;
let intervalTicks = 0;
const btnStop = document.getElementById("btn-stop-timer");

document.getElementById("btn-demo-timer").addEventListener("click", () => {
  if (intervalId !== null) {
    showOutput("out-timer", ["ℹ️ Interval already running. Stop it first."], "#f59e0b");
    return;
  }

  const heavyData = new Array(10_000).fill("interval-payload");
  intervalTicks = 0;

  // This interval runs indefinitely until cleared
  intervalId = setInterval(() => {
    intervalTicks++;
    // heavyData is kept alive by this closure
    const entry = heavyData[intervalTicks % heavyData.length];

    const el = document.getElementById("out-timer");
    if (el) {
      el.textContent = [
        `✅ Interval running — tick #${intervalTicks}`,
        `   Accessing heavyData[${intervalTicks % heavyData.length}]: "${entry}"`,
        `   heavyData (10K items) is kept alive by this closure.`,
        `   Click 'Stop Interval' to clear it and free memory.`,
      ].join("\n");
    }
  }, 800);

  btnStop.disabled = false;
  showOutput("out-timer", ["Interval started..."]);
});

btnStop.addEventListener("click", () => {
  if (intervalId === null) return;

  clearInterval(intervalId); // ✅ stops the callback AND releases the closure scope
  intervalId = null;
  btnStop.disabled = true;

  showOutput("out-timer", [
    `✅ Interval cleared after ${intervalTicks} ticks.`,
    `   clearInterval() removed the callback from the event loop.`,
    `   The closure (including heavyData) is now eligible for GC.`,
    `   Always store interval IDs and clear them when done!`,
  ]);
});

// ─── Demo 5: Detached DOM Nodes ───────────────────────────────────────────────

let detachedRef = null;

document.getElementById("btn-demo-dom").addEventListener("click", () => {
  const out = [];

  // Create a real DOM element
  const div = document.createElement("div");
  div.dataset.payload = "some-large-payload".repeat(100);
  div.textContent = "I am a DOM node";
  document.body.appendChild(div);

  out.push("1. div created and appended to document.body");

  // Remove from DOM but keep a JS reference
  detachedRef = div;
  div.remove();

  out.push("2. div.remove() — removed from DOM");
  out.push(`3. detachedRef still points to the div: ${detachedRef !== null}`);
  out.push(`   isConnected: ${detachedRef.isConnected} (false = detached from DOM)`);
  out.push("   ❌ The div is NOT in the DOM, but IS in memory (detached node leak)");
  out.push("");
  out.push("4. Setting detachedRef = null...");

  detachedRef = null; // ✅ now the div can be GC'd

  out.push("   detachedRef = null → div is now unreachable → eligible for GC ✅");
  out.push("");
  out.push("💡 Check: DevTools → Memory → Heap Snapshot");
  out.push("   Filter by 'Detached' to find detached DOM nodes in real apps.");

  showOutput("out-dom", out);
});

// ─── Demo 6: Map vs WeakMap Cache ────────────────────────────────────────────

document.getElementById("btn-demo-cache").addEventListener("click", () => {
  const out = [];

  // ❌ Map-based cache — holds strong references
  const mapCache = new Map();

  function processWithMap(userId, data) {
    if (!mapCache.has(userId)) {
      mapCache.set(userId, { processed: true, data });
    }
    return mapCache.get(userId);
  }

  // ✅ WeakMap-based cache — holds weak references (objects only as keys)
  const weakCache = new WeakMap();

  function processWithWeakMap(userObj) {
    if (!weakCache.has(userObj)) {
      weakCache.set(userObj, { processed: true, id: userObj.id });
    }
    return weakCache.get(userObj);
  }

  // Simulate using both
  processWithMap("user-1", "Alice's data");
  processWithMap("user-2", "Bob's data");
  processWithMap("user-3", "Carol's data");

  let user1 = { id: "u1", name: "Alice" };
  let user2 = { id: "u2", name: "Bob" };
  processWithWeakMap(user1);
  processWithWeakMap(user2);

  out.push(`Map cache size: ${mapCache.size} entries`);
  out.push("   Map holds strong references → entries never GC'd automatically");
  out.push(`   Even if original data is gone, Map keeps it alive!`);
  out.push(``);

  // Nullify user objects — WeakMap entries become GC-eligible
  user1 = null;
  user2 = null;

  out.push(`WeakMap: user1 and user2 set to null`);
  out.push("   WeakMap holds WEAK references → when user objects have no other refs,");
  out.push("   WeakMap entries are automatically eligible for GC ✅");
  out.push(``);
  out.push("WeakMap limitations:");
  out.push("  - Keys must be objects (not primitives)");
  out.push("  - Not iterable (cannot enumerate entries)");
  out.push("  - No .size property");
  out.push(``);
  out.push("💡 Use WeakMap when you want cache tied to object lifetime.");
  out.push("💡 Use Map with manual eviction (LRU, TTL) for larger caches.");

  showOutput("out-cache", out);
});

// ─── Console: GC Concepts ─────────────────────────────────────────────────────

console.group("🗑️ Memory Management Concepts");

// Mark-and-Sweep demonstration (conceptual)
console.log("Mark-and-Sweep: objects become unreachable when no references exist");

let obj = { name: "will be GC'd", nested: { value: 42 } };
let ref2 = obj; // two references to same object

console.log("obj and ref2 both reference the same object:", obj === ref2);

obj = null;
console.log("After obj = null: ref2 still holds the object:", ref2.name);
// obj is null, but ref2 still references the object → NOT eligible for GC yet

ref2 = null;
console.log("After ref2 = null: object has 0 references → eligible for GC");

// Circular references (handled correctly by Mark-and-Sweep)
(function circularDemo() {
  const a = {};
  const b = {};
  a.ref = b;
  b.ref = a;
  // Both a and b reference each other. After function returns:
  // - Local 'a' and 'b' variables are gone
  // - Neither is reachable from GC roots
  // - Mark-and-Sweep correctly identifies both as unreachable → freed ✅
  console.log("Circular reference created inside function — will be GC'd when function exits");
})();

// WeakRef usage
const resource = { data: new Array(1000).fill("resource") };
const weakRef = new WeakRef(resource);

const resolved = weakRef.deref();
console.log("WeakRef.deref() while object alive:", resolved !== undefined ? "got object" : "undefined");

// Note: Setting resource = null and calling GC is not deterministic in browsers
// In production, use WeakRef for cache invalidation awareness, not critical logic.

console.groupEnd();
