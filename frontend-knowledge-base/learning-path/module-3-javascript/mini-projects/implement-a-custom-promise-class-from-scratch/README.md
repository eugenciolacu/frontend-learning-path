# Mini-Project: Implement a Custom Promise Class from Scratch

A browser-based interactive playground that builds a **Promises/A+ compliant `MyPromise` class** from zero, paired with an automated test suite and 10 live demos — all grounded in Module 3 theory.

## Project Structure

```
implement-a-custom-promise-class-from-scratch/
├── index.html          # UI: tab navigation, state diagram, demo grid, test panel
├── style.css           # Dark theme, console output, test result cards
├── README.md           # This file
└── js/
    ├── my-promise.js   # MyPromise class — Promises/A+ implementation   (Chapter 9)
    ├── test-runner.js  # Async test framework + 25 test cases            (Chapters 2–5, 8)
    └── main.js         # App orchestration, 10 live demos, event binding (Chapters 1–11)
```

## How to Run

This project uses **ES Modules** (`<script type="module">`). Browsers block module imports over the `file://` protocol, so you must serve the folder through a local HTTP server.

**Option A – VS Code Live Server extension**
Right-click `index.html` → *Open with Live Server*.

**Option B – Node.js one-liner**
```bash
npx http-server .
```
Then open `http://localhost:8080`.

---

## Features

| Feature | Description |
|---|---|
| `MyPromise` class | Full Promises/A+ state machine using ES private class fields |
| `.then()` / `.catch()` / `.finally()` | Chaining, error recovery, and cleanup |
| Static combinators | `resolve`, `reject`, `all`, `race`, `allSettled`, `any`, `withResolvers` |
| Thenable interop | Works with native `Promise`, `async/await`, and any `.then`-able |
| Microtask scheduling | Uses `queueMicrotask` for correct async ordering (Ch. 7 & 9) |
| Test suite | 25 automated tests across 5 suites — auto-run on page load |
| 10 live demos | Covers every combinator, error recovery, retry, generators, and interop |
| Retry with back-off | Exponential retry built from closures and `async/await` (Ch. 8 & 9) |
| Debounce utility | Chapter 11 closure-based function rate-limiter |
| Generator interop | Chapter 8 generators producing lazy `MyPromise` sequences |

---

## Concepts Demonstrated by Chapter

### Chapter 1 – JS Basics
- `const` for module-level immutable constants (`STATE`, `delay`)
- `let` for mutable counters (`attempt`, `remaining`, `i`)
- **Template literals** in `createLogger`, `createFakeRequest`, and all assertion messages: `` `${label}: expected ${JSON.stringify(expected)}` ``
- `typeof` for thenable detection: `typeof value.then === 'function'`
- **Ternary operator**: `typeof onFulfilled === 'function' ? onFulfilled(this.#value) : this.#value`
- Nullish coalescing `??` in test-runner grouping: `acc[t.suite] = acc[t.suite] ?? []`
- `Math.random()` for simulated failure rates in `createFakeRequest(failRate)`
- `Date.now()` for elapsed-time measurements in the `Promise.all` demo

### Chapter 2 – Control Flow and Functions
- **Arrow functions** throughout: all `.then()` / `.catch()` callbacks, `delay`, `createFakeRequest`
- **Named function declarations** for top-level utilities: `createLogger`, `retry`, `debounce`, `runAllTests`
- **Default parameters**: `type = 'info'` in the logger; `maxAttempts = 3, baseMs = 100` in `retry`; `suite = 'General'` in `test()`; `step = 1` in `promiseSequence`
- `for...of` loop in `runAllTests()` to iterate suites and individual test cases sequentially with `await`
- `for` loop with `let` in `retry()` for the attempt counter
- `if / return` early-exit guard: `if (this.#state !== STATE.PENDING) return;`
- `try / catch` in the `MyPromise` constructor and around every test function invocation

### Chapter 3 – Objects and Arrays
- `Object.freeze(STATE)` — immutable state enum; prevents external mutation
- `Array.prototype.reduce()` in `runAllTests()` to group tests by suite name into a plain object
- `Array.prototype.forEach()` in `#runHandlers`, `MyPromise.all`, `MyPromise.race`, `MyPromise.any`
- `Array.prototype.map()` in `MyPromise.allSettled` to transform each promise into a settlement object
- `new Array(promises.length)` — pre-allocated array preserves insertion order in `all` and `any`
- **Destructuring** in `for...of`: `for (const { status, value, reason } of settled)`
- `Object.entries(suites)` to iterate `[suiteName, testsArray]` pairs in the test runner

### Chapter 4 – The DOM and Events
- `document.querySelectorAll('[data-tab]')` for tab navigation selection
- `document.getElementById` for specific elements: `demo-output`, `btn-run-tests`
- `document.createElement` in `createLogger`, `clearOutput`, and `runAllTests`
- `element.appendChild` for tree construction; all DOM writes batched per log entry
- `element.textContent` for safe plain-text updates (test names, error messages, log lines)
- `element.className` for applying `log-success`, `log-error`, `test-pass`, `test-fail` classes
- `element.classList.add` / `.remove` for active tab / panel toggling
- `element.setAttribute('aria-selected', 'true')` for accessible tab state
- `element.scrollTop = element.scrollHeight` for auto-scroll in the console output
- `element.disabled` and `element.textContent` on the run-tests button during execution
- `addEventListener('click', ...)` on all 10 demo buttons, 2 utility buttons, and tab bar

### Chapter 5 – Asynchronous JavaScript
- `async / await` in all 10 demo handlers and in `runAllTests()` — reads like synchronous code
- `try / catch / finally` — demonstrated explicitly in Demo 4 (error handling) and used in the test runner
- **`MyPromise` is a thenable**: native `await` works on it because it implements `.then()` — interop with the spec
- **`fetch`-like simulation** via `createFakeRequest()`: `setTimeout`-based async returning `MyPromise`
- `Promise.all` (native) mixed with `MyPromise.resolve` in Demo 9 to show cross-library interop
- Error lifecycle: `.catch()` for recovery, `.finally()` for cleanup regardless of outcome

### Chapter 6 – Tooling, Debugging, and Modules
- **ES Modules**: `export { MyPromise, STATE }` from `my-promise.js`; `export { runAllTests }` from `test-runner.js`; named `import` in `main.js`
- `<script type="module" src="js/main.js">` in `index.html`
- Console-style output rendered in the DOM: mirrors `console.log`, `console.error`, `console.warn` — styled by log type

### Chapter 7 – The JavaScript Engine & Execution
- **Demo 3 (Microtask Ordering)** directly visualises the event loop mental model from the chapter:
  - Synchronous code executes first (`order.push('1-sync-start')`)
  - `MyPromise.resolve().then()` schedules a **microtask** via `queueMicrotask` — runs before any macrotask
  - `Promise.resolve().then()` (native) also schedules a microtask
  - `setTimeout(fn, 0)` schedules a **macrotask** — always runs after all microtasks are flushed
  - Output invariably: `sync → microtask → macrotask`
- `queueMicrotask()` inside `MyPromise#runHandlers` is the direct, intentional use of the microtask queue browser API

### Chapter 8 – Advanced Language Mechanics
- **Private class fields** (`#state`, `#value`, `#handlers`) — external code cannot read or mutate promise internals
- **`this` binding via `.call()`**: `then.call(value, resolveHandler, rejectHandler)` in thenable resolution (Promises/A+ §2.3.3.3)
- **Closures in `createLogger`**: the returned `log` function captures `outputEl` from the outer scope — each demo has its own logger bound to the same output element
- **Closures in `retry`**: `attempt` counter persists across retry iterations via the enclosing `for` scope
- **Closures in `debounce`**: `timer` variable persists between rapid invocations without any global state
- **Generator function** (`function* promiseSequence(...)`) in Demo 10 — produces a lazy sequence of `MyPromise` instances; no work happens until the consumer pulls a value with `for...of`
- **Iterator protocol**: `for...of` calls the generator's `.next()` under the hood, demonstrating Chapter 8's iterator/generator section

### Chapter 9 – Advanced Asynchronous Patterns
- **`MyPromise` state machine** mirrors exactly §1.1 of the chapter theory: three states, irreversible transitions
- **`queueMicrotask`** in `#runHandlers` implements §1.2 — microtask scheduling for `.then()` callbacks
- **Promise chaining and flattening** (§1.3): `then()` always returns a new `MyPromise`; if the callback itself returns a thenable, the chain waits for it (assimilation/flattening)
- **Thenable resolution** (Promises/A+ §2.3): checks `typeof value.then === 'function'` with full guard against accessor throws
- **`Promise.all`** concurrent execution: all requests fire simultaneously; resolves only when all settle
- **`Promise.race`**: first-settled wins; remaining results discarded
- **`Promise.allSettled`**: never rejects; returns structured `{ status, value/reason }` objects — safe for partial-failure dashboards
- **`Promise.any`**: resolves with first fulfillment; rejects with `AggregateError` if all fail
- **`MyPromise.withResolvers()`**: separates promise creation from resolution — advanced orchestration pattern
- **Retry with exponential back-off**: composes `async/await` + `MyPromise` + a `for` loop

### Chapter 10 – Design Patterns & Paradigms
- **Factory pattern**: `createFakeRequest(label, delayMs, failRate)` returns a factory function that produces a new `MyPromise` on each call — parameterised object creation without `new` at call sites
- **Immutability**: `Object.freeze(STATE)` — functional programming principle applied to prevent accidental state mutation
- **Pure functions**: `createLogger`, `delay`, `debounce`, and `retry` have no global side-effects — they receive all their dependencies as parameters or through closure
- **Composition**: `MyPromise.allSettled` is entirely composed from `MyPromise.all` + `MyPromise.resolve` + `.then()` — no new internal mechanism needed

### Chapter 11 – Browser Capabilities & Performance
- **`debounce`** utility: implemented via closures + `setTimeout` / `clearTimeout` — limits rapid successive function calls, the canonical Chapter 11 utility
- **`queueMicrotask`** is a first-class browser (and Node.js ≥ 11) API — `MyPromise` leverages it directly to schedule handlers in the microtask queue
- **Console auto-scroll** (`scrollTop = scrollHeight`) — DOM read/write cycle; the implementation avoids thrashing by performing only one scroll after each append (single write, no layout recalculation loop)
