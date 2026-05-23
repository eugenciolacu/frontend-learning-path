/* ─────────────────────────────────────────────────────────────────────────
 *  main.js — Application entry point
 *  Orchestrates 10 live demos and the automated test runner.
 *
 *  Chapter 1  – const/let, template literals, typeof, ternary, Math.random,
 *               Date.now, nullish coalescing (??)
 *  Chapter 2  – Arrow functions, for...of, conditionals, default params,
 *               named function declarations, rest/spread
 *  Chapter 3  – Array.from, map, filter, forEach, spread, destructuring,
 *               Object.entries
 *  Chapter 4  – querySelectorAll, getElementById, createElement, appendChild,
 *               classList, addEventListener, scrollTop
 *  Chapter 5  – async/await, try/catch/finally, fetch-like simulation,
 *               Promise.all (native + MyPromise mixed)
 *  Chapter 6  – ES Modules: import, console methods
 *  Chapter 7  – Microtask vs macrotask execution order demonstration
 *  Chapter 8  – Closures (logger, debounce, retry), generators, this binding
 *  Chapter 9  – MyPromise: all, race, allSettled, any, withResolvers, retry
 *  Chapter 10 – Factory pattern (createFakeRequest), pure functions,
 *               composition
 *  Chapter 11 – debounce utility, queueMicrotask browser API
 * ─────────────────────────────────────────────────────────────────────────
 */

// Chapter 6: ES Module named imports
import { MyPromise }   from './my-promise.js';
import { runAllTests } from './test-runner.js';

// ── Console logger ───────────────────────────────────────────────────────────

/**
 * Returns a bound log function scoped to a specific DOM element.
 * Chapter 8 – Closure: the returned function captures `outputEl`.
 * Chapter 2 – Default parameter: type = 'info'
 */
function createLogger(outputEl) {
  return function log(message, type = 'info') {
    const line = document.createElement('div');  // Chapter 4
    line.className = `log-line log-${type}`;
    // Chapter 1: template literal
    line.textContent = `${new Date().toLocaleTimeString('en-GB', { hour12: false })}  ${message}`;
    outputEl.appendChild(line);
    // Chapter 11: scroll to latest entry without layout thrash
    outputEl.scrollTop = outputEl.scrollHeight;
  };
}

/** Clear the output area and print a section divider. */
function clearOutput(outputEl, title) {
  outputEl.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'log-line log-title';
  header.textContent = `── ${title} ──`;
  outputEl.appendChild(header);
}

// ── Utility functions ────────────────────────────────────────────────────────

/**
 * Chapter 5: wraps setTimeout in a native Promise.
 * (Native Promise used here deliberately to show MyPromise interop.)
 */
const delay = ms => new Promise(r => setTimeout(r, ms));

/**
 * Retry with exponential back-off.
 * Chapter 9  – Advanced async orchestration pattern.
 * Chapter 8  – Closure: `attempt` and `baseMs` persist across retries.
 * Chapter 2  – for loop, default parameters.
 *
 * @param {() => MyPromise} fn      Factory returning a MyPromise each call
 * @param {number} maxAttempts
 * @param {number} baseMs           Initial delay before first retry (ms)
 */
function retry(fn, maxAttempts = 3, baseMs = 100) {
  return new MyPromise(async (resolve, reject) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await fn(); // Chapter 5: await inside async executor
        resolve(result);
        return;
      } catch (err) {
        if (attempt === maxAttempts) { reject(err); return; }
        await delay(baseMs * attempt); // Exponential back-off
      }
    }
  });
}

/**
 * Debounce — limits how often a function fires.
 * Chapter 11 – Browser performance: avoid excessive event handling.
 * Chapter 8  – Closure: `timer` persists between invocations.
 */
function debounce(fn, ms) {
  let timer;
  return function (...args) { // Chapter 2: rest params
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms); // Chapter 8: .apply()
  };
}

/**
 * Simulated network request factory.
 * Chapter 10 – Factory pattern: parameterised object creation.
 * Chapter 1  – Math.random() and Date.now() for realistic simulation.
 *
 * @param {string} label
 * @param {number} delayMs
 * @param {number} failRate  0–1 probability of rejection
 */
function createFakeRequest(label, delayMs, failRate = 0) {
  // Returns a factory fn; calling it returns a MyPromise
  return () => new MyPromise((resolve, reject) => {
    setTimeout(() => {
      // Chapter 1: Math.random() comparison
      if (Math.random() < failRate) {
        reject(new Error(`${label}: simulated network failure`));
      } else {
        resolve({ label, data: `Response from ${label}`, ts: Date.now() });
      }
    }, delayMs);
  });
}

// ── Tab navigation ───────────────────────────────────────────────────────────

// Chapter 4: querySelectorAll, classList, addEventListener
const tabs   = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('[data-panel]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t   => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    // Chapter 4: querySelector with attribute selector
    document.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// ── Demo console setup ───────────────────────────────────────────────────────

const demoOutput = document.getElementById('demo-output');
const log        = createLogger(demoOutput); // Chapter 8: closure

document.getElementById('btn-clear').addEventListener('click', () => {
  demoOutput.innerHTML = '<div class="log-line log-info">← Click a demo button above.</div>';
});

// ── Demo 1: Basic Resolve / Reject ───────────────────────────────────────────
// Chapter 5: Promises (basic creation), Chapter 9: state machine

document.getElementById('btn-basic').addEventListener('click', () => {
  clearOutput(demoOutput, 'Basic Resolve / Reject');

  // Fulfilled promise
  new MyPromise(resolve => resolve('Hello, MyPromise!'))
    .then(v => log(`✓ Fulfilled with: "${v}"`, 'success'));

  // Rejected promise
  new MyPromise((_, reject) => reject(new Error('Something went wrong')))
    .catch(e => log(`✗ Rejected with: "${e.message}"`, 'error'));

  // Executor throws synchronously
  new MyPromise(() => { throw new TypeError('Executor threw!'); })
    .catch(e => log(`⚠ Executor throw caught: "${e.message}"`, 'warn'));

  // Second resolve is a no-op — state is locked after first settle
  new MyPromise(resolve => { resolve('First'); resolve('Second'); })
    .then(v => log(`🔒 State locked — only first resolve: "${v}"`, 'info'));
});

// ── Demo 2: Promise Chaining ─────────────────────────────────────────────────
// Chapter 5: chaining, async/await; Chapter 9: flattening

document.getElementById('btn-chain').addEventListener('click', async () => {
  clearOutput(demoOutput, 'Promise Chain (5 steps + finally)');
  log('Starting…', 'info');

  try {
    const result = await MyPromise.resolve(1)
      .then(v => { log(`  Step 1 → received ${v}, returning ${v + 1}`, 'success'); return v + 1; })
      .then(v => { log(`  Step 2 → received ${v}, returning ${v * 10}`, 'success'); return v * 10; })
      .then(v => {
        log(`  Step 3 → received ${v}, starting 400 ms async delay…`, 'success');
        // Chapter 9: flattening — returning a thenable suspends the chain
        return new MyPromise(r => setTimeout(() => r(v + 5), 400));
      })
      .then(v => { log(`  Step 4 → received ${v} after delay`, 'success'); return v; })
      .then(v => { log(`  Step 5 → returning v * 2 = ${v * 2}`, 'success'); return v * 2; })
      .finally(() => log('  [finally] always runs — cleanup here', 'info'));

    log(`Chain complete — final value: ${result}`, 'success');
  } catch (err) {
    log(`Chain error: ${err.message}`, 'error');
  }
});

// ── Demo 3: Microtask Ordering ───────────────────────────────────────────────
// Chapter 7: event loop mental model; Chapter 9: queueMicrotask

document.getElementById('btn-microtask').addEventListener('click', () => {
  clearOutput(demoOutput, 'Microtask vs Macrotask — Event Loop');

  const order = [];

  log('[sync] 1 — synchronous code starts', 'info');
  order.push('1-sync-start');

  // Schedules a MICROTASK (via queueMicrotask internally)
  MyPromise.resolve().then(() => {
    order.push('3-MyPromise-microtask');
    log('[microtask] 3 — MyPromise.resolve().then()', 'success');
  });

  // Native Promise — also a microtask
  Promise.resolve().then(() => {
    order.push('3-native-microtask');
    log('[microtask] 3 — native Promise.resolve().then()', 'success');
  });

  // Schedules a MACROTASK — always after all microtasks
  setTimeout(() => {
    order.push('4-macrotask');
    log('[macrotask] 4 — setTimeout(fn, 0)', 'warn');
    log(`Recorded order: ${order.join(' → ')}`, 'info');
  }, 0);

  log('[sync] 2 — synchronous code ends', 'info');
  order.push('2-sync-end');
});

// ── Demo 4: Error Handling & Recovery ───────────────────────────────────────
// Chapter 5: catch/recovery, finally; Chapter 9: chaining

document.getElementById('btn-errors').addEventListener('click', async () => {
  clearOutput(demoOutput, 'Error Handling & Recovery');

  const result = await MyPromise.resolve('start')
    .then(v  => { log(`  ✓ OK: "${v}"`, 'success'); throw new Error('Intentional error!'); })
    .then(()  => log('  ← SKIPPED: never runs when previous threw', 'warn'))
    .catch(e  => { log(`  ✗ Caught: "${e.message}" → recovering with 'recovered'`, 'error'); return 'recovered'; })
    .then(v  => { log(`  ✓ Continuing after recovery: "${v}"`, 'success'); return v.toUpperCase(); })
    .finally(()=> log('  [finally] cleanup runs regardless', 'info'));

  log(`Done — final value: "${result}"`, 'success');
});

// ── Demo 5: MyPromise.all ────────────────────────────────────────────────────
// Chapter 9: concurrent execution, Promise.all

document.getElementById('btn-all').addEventListener('click', async () => {
  clearOutput(demoOutput, 'MyPromise.all — Concurrent Requests');

  const t0      = Date.now();
  const elapsed = () => `+${Date.now() - t0}ms`;

  log('Firing 3 requests concurrently (200 ms, 100 ms, 300 ms)…', 'info');

  try {
    // Chapter 3: destructuring the array result
    const [a, b, c] = await MyPromise.all([
      createFakeRequest('API-A', 200)().then(r => { log(`  ✓ ${r.label} resolved (${elapsed()})`, 'success'); return r.data; }),
      createFakeRequest('API-B', 100)().then(r => { log(`  ✓ ${r.label} resolved (${elapsed()})`, 'success'); return r.data; }),
      createFakeRequest('API-C', 300)().then(r => { log(`  ✓ ${r.label} resolved (${elapsed()})`, 'success'); return r.data; }),
    ]);

    log(`All done (${elapsed()}): [${a}, ${b}, ${c}]`, 'success');
    log('Total wall-clock time ≈ slowest request, not the sum.', 'info');
  } catch (err) {
    log(`One failed: ${err.message}`, 'error');
  }
});

// ── Demo 6: MyPromise.race ───────────────────────────────────────────────────
// Chapter 9: Promise.race — first-settled wins

document.getElementById('btn-race').addEventListener('click', async () => {
  clearOutput(demoOutput, 'MyPromise.race — First Wins');

  const t0     = Date.now();
  const winner = await MyPromise.race([
    createFakeRequest('Fast (80 ms)',   80)(),
    createFakeRequest('Medium (200 ms)', 200)(),
    createFakeRequest('Slow (400 ms)',  400)(),
  ]);

  log(`Race won by: "${winner.label}" (+${Date.now() - t0}ms)`, 'success');
  log('Other requests continue running but their outcomes are discarded.', 'info');
});

// ── Demo 7: allSettled + any ─────────────────────────────────────────────────
// Chapter 9: allSettled (never rejects), any (first fulfillment)

document.getElementById('btn-settled').addEventListener('click', async () => {
  clearOutput(demoOutput, 'allSettled + any');

  // allSettled — collect all outcomes regardless of rejection
  log('─── MyPromise.allSettled ───', 'title');
  const settled = await MyPromise.allSettled([
    createFakeRequest('Service-1', 100)(),
    createFakeRequest('Service-2', 150, 1.0)(), // Always fails
    createFakeRequest('Service-3', 200)(),
  ]);

  // Chapter 3: for...of + destructuring
  for (const { status, value, reason } of settled) {
    if (status === 'fulfilled') {
      log(`  ✓ fulfilled: "${value.label}"`, 'success');
    } else {
      log(`  ✗ rejected: "${reason.message}"`, 'error');
    }
  }

  // any — resolves with first fulfillment
  log('─── MyPromise.any ───', 'title');
  const first = await MyPromise.any([
    createFakeRequest('Replica-A', 300, 0.5)(),  // 50 % chance to fail
    createFakeRequest('Replica-B', 100)(),
    createFakeRequest('Replica-C', 200, 0.5)(),
  ]).catch(e => `All failed: ${e.message}`);

  const isString = typeof first === 'string';
  log(`  any → "${isString ? first : first.label}"`, isString ? 'error' : 'success');
});

// ── Demo 8: Retry with Exponential Back-off ──────────────────────────────────
// Chapter 9: advanced async pattern; Chapter 8: closure for attempt counter

document.getElementById('btn-retry').addEventListener('click', async () => {
  clearOutput(demoOutput, 'Retry with Exponential Back-off');

  let attempt = 0;

  // Chapter 10: factory returns a new MyPromise each call
  const unreliableRequest = () => {
    attempt++;
    log(`  Attempt #${attempt}…`, 'info');
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        if (attempt < 3) {
          reject(new Error(`Attempt ${attempt} failed (simulated)`));
        } else {
          resolve(`Success on attempt ${attempt}!`);
        }
      }, 50);
    });
  };

  try {
    const result = await retry(unreliableRequest, 4, 50);
    log(`Result: "${result}"`, 'success');
  } catch (err) {
    log(`All retries exhausted: ${err.message}`, 'error');
  }
});

// ── Demo 9: Async / Await Interop ────────────────────────────────────────────
// Chapter 5: async/await; Chapter 9: MyPromise as a thenable

document.getElementById('btn-async').addEventListener('click', async () => {
  clearOutput(demoOutput, 'Async / Await Interop');
  log('MyPromise is a thenable — native await works seamlessly:', 'info');

  // Chapter 5: async function that awaits MyPromise instances
  async function runPipeline() {
    const step1 = await MyPromise.resolve(10);
    log(`  step1 = ${step1}`, 'success');

    // Chapter 9: async delay via MyPromise + setTimeout
    const step2 = await new MyPromise(r => setTimeout(() => r(step1 * 2), 200));
    log(`  step2 = ${step2}  (after 200 ms delay)`, 'success');

    // Chapter 9: mix native Promise.all with MyPromise.resolve
    const [a, b] = await Promise.all([
      MyPromise.resolve(step2 + 1),
      MyPromise.resolve(step2 + 2),
    ]);
    log(`  concurrent: a = ${a}, b = ${b}`, 'success');

    return a + b;
  }

  const final = await runPipeline().catch(e => `Error: ${e.message}`);
  log(`Pipeline result: ${final}`, 'success');
});

// ── Demo 10: Generator + MyPromise Sequence ──────────────────────────────────
// Chapter 8: generator function (iterator protocol); Chapter 5: await

document.getElementById('btn-generator').addEventListener('click', async () => {
  clearOutput(demoOutput, 'Generator + MyPromise Lazy Sequence');

  /**
   * Chapter 8: generator — produces a lazy, on-demand sequence of MyPromises.
   * No work is done until the consumer pulls each value with for...of.
   * @param {number} start
   * @param {number} count
   * @param {number} step
   */
  function* promiseSequence(start, count, step = 1) {
    for (let i = 0; i < count; i++) {
      yield new MyPromise(resolve =>      // Each yield produces one promise
        setTimeout(() => resolve(start + i * step), 80),
      );
    }
  }

  log('Consuming lazy sequence of 5 MyPromises (×10 step):', 'info');

  // Chapter 2: for...of iterates the generator — pulls one value at a time
  // Chapter 5: await suspends until each MyPromise resolves
  let index = 1;
  for (const p of promiseSequence(10, 5, 10)) {
    const val = await p;
    log(`  [${index++}] resolved → ${val}`, 'success');
  }

  log('Sequence complete.', 'success');
});

// ── Test Runner tab ──────────────────────────────────────────────────────────

const testContainer = document.getElementById('test-results');
const runTestsBtn   = document.getElementById('btn-run-tests');

// Chapter 4: addEventListener
runTestsBtn.addEventListener('click', async () => {
  runTestsBtn.disabled    = true;          // Chapter 4: element property
  runTestsBtn.textContent = 'Running…';
  await runAllTests(testContainer);
  runTestsBtn.disabled    = false;
  runTestsBtn.textContent = 'Run All Tests Again';
});

// Auto-run on page load so results are immediately visible
runAllTests(testContainer);
