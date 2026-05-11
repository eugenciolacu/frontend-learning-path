# Chapter 7: The JavaScript Engine & Execution (Advanced)

## Overview

This chapter dives deep into how JavaScript actually works under the hood — from how engines like V8 parse and compile your code, to how the event loop orchestrates async operations, and how memory is managed (and mismanaged). Understanding these mechanisms is essential for writing performant, bug-free JavaScript at a professional level.

---

## 1. V8 Engine Basics, JIT Compilation & the Call Stack

### What is a JavaScript Engine?

A JavaScript engine is a program that reads, interprets, and executes JavaScript code. The most widely used engine is **V8**, built by Google, and it powers both **Chrome** and **Node.js**.

Other engines:
| Engine | Used By |
|---|---|
| V8 | Chrome, Node.js, Edge (Chromium) |
| SpiderMonkey | Firefox |
| JavaScriptCore (Nitro) | Safari |
| Hermes | React Native |

### The V8 Pipeline (How Code Goes from Source to Execution)

```
Source Code
    │
    ▼
[Parser] → Abstract Syntax Tree (AST)
    │
    ▼
[Ignition - Interpreter] → Bytecode (executed immediately)
    │
    ▼ (hot code / frequently called)
[TurboFan - Optimizing Compiler] → Optimized Machine Code
    │
    ▼ (if type changes → deoptimize)
[Back to Ignition]
```

1. **Parsing** — The source code is tokenized and parsed into an **Abstract Syntax Tree (AST)**, a structured representation of the program.
2. **Ignition (Interpreter)** — The AST is compiled to **bytecode** and executed immediately. This provides a fast startup time.
3. **TurboFan (JIT Compiler)** — Functions that are called frequently ("hot code") are identified by profiling and compiled into **optimized native machine code**, making them run significantly faster.

### Abstract Syntax Tree (AST)

The AST is an intermediate, structured representation of your code:

```js
const x = 5 + 3;
```

This is parsed into something like:

```
VariableDeclaration (const)
  └── VariableDeclarator
        ├── Identifier: x
        └── BinaryExpression (+)
              ├── Literal: 5
              └── Literal: 3
```

> You can explore ASTs interactively at [astexplorer.net](https://astexplorer.net).

### JIT (Just-In-Time) Compilation

JIT means code is compiled **during** execution, not ahead of time. V8 monitors which functions are called often (hot functions) and compiles those to optimized machine code on the fly.

**The key to optimization: type consistency.** V8 creates "hidden classes" and assumes objects always have the same shape. When input types are consistent, V8 can generate highly optimized code.

**Deoptimization** occurs when an assumption is violated (e.g., a function receives a different type than expected). V8 falls back to interpreted bytecode.

```js
function add(a, b) {
  return a + b;
}

// V8 optimizes 'add' for numbers after seeing it called with numbers many times
for (let i = 0; i < 100000; i++) {
  add(i, i + 1); // consistent: number + number
}

// Now passing strings causes deoptimization!
add("hello", " world"); // V8 must abandon the optimized version
```

**Best Practice:** Keep function argument types consistent. Avoid mixing types in tight loops.

```js
// ❌ Inconsistent — hurts JIT optimization
function process(value) {
  if (typeof value === "number") return value * 2;
  if (typeof value === "string") return value.toUpperCase();
}

// ✅ Consistent — V8 can stay optimized
function doubleNumber(n) { return n * 2; }
function upperString(s) { return s.toUpperCase(); }
```

### The Call Stack

The **Call Stack** is a LIFO (Last In, First Out) data structure that tracks the current execution point. Every time a function is called, a new **stack frame** is pushed onto the stack. When the function returns, its frame is popped.

JavaScript is **single-threaded**: only one stack frame executes at a time.

```js
function greet(name) {
  return `Hello, ${name}!`;
}

function displayMessage() {
  const message = greet("Alice");
  console.log(message);
}

displayMessage();
```

Stack evolution:
```
Step 1: [displayMessage]                   ← pushed
Step 2: [greet("Alice"), displayMessage]   ← pushed
Step 3: [displayMessage]                   ← greet returned, popped
Step 4: [console.log(...), displayMessage] ← pushed
Step 5: [displayMessage]                   ← console.log returned, popped
Step 6: (empty)                            ← displayMessage returned, popped
```

### Stack Overflow

If the call stack grows too deep (e.g., infinite recursion), you get a `RangeError: Maximum call stack size exceeded`.

```js
function recurse() {
  recurse(); // calls itself forever
}

recurse(); // RangeError: Maximum call stack size exceeded
```

**Safe recursion** uses a base case:

```js
function factorial(n) {
  if (n <= 1) return 1;   // base case — stops recursion
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

For very deep recursion, use **trampolining** or convert to an iterative loop to avoid stack overflow.

---

## 2. Execution Context, Hoisting & Scope Chains

### Execution Context

An **Execution Context (EC)** is the abstract environment in which JavaScript code is evaluated. Every time JavaScript runs code, it does so inside an EC.

**Types of Execution Contexts:**
1. **Global Execution Context (GEC)** — Created once when the script starts. In browsers, `this` refers to `window`.
2. **Function Execution Context (FEC)** — Created each time a function is invoked.
3. **Eval Execution Context** — Created inside `eval()`. Avoid using `eval()`.

### Phases of an Execution Context

Each EC is created in two phases:

**Phase 1: Creation Phase**
- Scope chain is set up
- Variable declarations are processed (**hoisting**)
- `this` is determined

**Phase 2: Execution Phase**
- Code runs line by line
- Variable assignments happen

**Components of an EC:**
- **Variable Environment** — stores `var` declarations and function declarations
- **Lexical Environment** — stores `let`/`const` declarations and the outer scope reference
- **`this` binding** — references the current context object

```js
var globalName = "Alice"; // lives in Global EC

function greet() {
  var greeting = "Hello"; // lives in greet's Function EC
  console.log(`${greeting}, ${globalName}!`); // "Hello, Alice!"
}

greet();
```

### Hoisting

**Hoisting** is JavaScript's behavior of processing declarations before code executes (during the Creation Phase). The key insight: **declarations are hoisted, initializations are not**.

#### `var` Hoisting

`var` declarations are hoisted and initialized to `undefined`:

```js
console.log(x); // undefined — NOT a ReferenceError
var x = 10;
console.log(x); // 10
```

Internally, this is equivalent to:

```js
var x;           // hoisted to top of scope, initialized to undefined
console.log(x);  // undefined
x = 10;          // assignment stays in place
console.log(x);  // 10
```

#### `let` and `const` — Temporal Dead Zone (TDZ)

`let` and `const` are also hoisted, but they are **NOT initialized**. Accessing them before their declaration throws a `ReferenceError`. The period between the start of the scope and the declaration is called the **Temporal Dead Zone (TDZ)**.

```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 20;
```

```js
{
  // TDZ for 'z' starts here
  console.log(z); // ReferenceError
  const z = 30;  // TDZ ends here
}
```

#### Function Declaration Hoisting

**Entire function bodies** are hoisted — you can call a function before it appears in the code:

```js
sayHello(); // Works! → "Hello, World!"

function sayHello() {
  console.log("Hello, World!");
}
```

#### Function Expression Hoisting

Only the **variable declaration** is hoisted — the function body is not:

```js
greet(); // TypeError: greet is not a function

var greet = function () {
  console.log("Hi!");
};
```

During hoisting, `var greet` is set to `undefined`. Calling `undefined()` throws a `TypeError`.

#### Arrow Functions

Arrow functions behave exactly like function expressions regarding hoisting:

```js
sayBye(); // TypeError: sayBye is not a function

var sayBye = () => console.log("Bye!");
```

### Scope

**Scope** defines the visibility and lifetime of variables.

| Scope Type | Applies To | Created By |
|---|---|---|
| Global Scope | Everywhere | Top-level declarations |
| Function Scope | Inside a function | `var`, function declarations |
| Block Scope | Inside `{}` | `let`, `const` |

```js
var globalVar = "global";    // Global scope

function myFunction() {
  var functionVar = "function"; // Function scope

  if (true) {
    let blockVar = "block";     // Block scope
    const alsoBlock = "block";  // Block scope
    console.log(blockVar);      // "block" ✅
  }

  console.log(functionVar);     // "function" ✅
  // console.log(blockVar);     // ReferenceError ❌
}

myFunction();
console.log(globalVar);         // "global" ✅
// console.log(functionVar);    // ReferenceError ❌
```

### The Scope Chain

When a variable is referenced, the JavaScript engine searches for it by traversing the **scope chain** outward:

1. Current scope
2. Outer (enclosing) scope
3. ... continues outward ...
4. Global scope
5. If not found → `ReferenceError`

```js
const planet = "Earth"; // Global scope

function outer() {
  const country = "Portugal"; // outer's scope

  function inner() {
    const city = "Lisbon"; // inner's scope

    // inner can access all outer scopes via the scope chain:
    console.log(city);    // "Lisbon"   — own scope
    console.log(country); // "Portugal" — outer's scope
    console.log(planet);  // "Earth"    — global scope
  }

  inner();
  // console.log(city); // ReferenceError — inner's scope not accessible from outer
}

outer();
```

### Lexical Scoping

JavaScript uses **lexical (static) scoping**: scope is determined by **where the code is written**, not where it is executed.

```js
const x = "global";

function outer() {
  const x = "outer";

  function inner() {
    // inner's outer scope is 'outer', regardless of where inner() is called
    console.log(x); // "outer" — lexically closest x
  }

  return inner;
}

const fn = outer();
fn(); // "outer" — NOT "global"! Scope was set when inner was defined, not called
```

This is the foundation of **closures** (covered in Chapter 8).

---

## 3. The Event Loop: Microtasks, Macrotasks & Web APIs

### Why Does the Event Loop Exist?

JavaScript is **single-threaded** — it can only do one thing at a time. But browsers need to handle many things concurrently: network requests, timers, user input, rendering. The **Event Loop** is the mechanism that enables non-blocking, asynchronous behavior in a single-threaded environment.

### The Concurrency Model — Key Components

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser / Node.js                        │
│                                                                  │
│  ┌─────────────┐     ┌──────────────────┐   ┌──────────────────┐ │
│  │  Call Stack │     │    Web APIs      │   │  Microtask Queue │ │
│  │             │     │  setTimeout()    │   │  Promise.then()  │ │
│  │ [main()]    │     │  fetch()         │   │  queueMicrotask  │ │
│  │ [greet()]   │     │  addEventListener│   │  MutationObserver│ │
│  └──────┬──────┘     └────────┬─────────┘   └────────┬─────────┘ │
│         │                     │                      │           │
│         │            ┌────────▼────────┐             │           │
│         │            │ Macrotask Queue │             │           │
│         │            │  setTimeout cb  │             │           │
│         │            │  setInterval cb │             │           │
│         │            │  I/O callbacks  │             │           │
│         │            └────────┬────────┘             │           │
│         │                     │                      │           │
│         └─────────────────────┴──────────────────────┘           │
│                          Event Loop                              │
└──────────────────────────────────────────────────────────────────┘
```

**Key Components:**
- **Call Stack** — Executes synchronous code, one frame at a time
- **Web APIs** — Browser-provided async capabilities (Node.js has equivalent C++ bindings)
- **Microtask Queue** — High-priority async callbacks
- **Macrotask Queue** (Task Queue / Callback Queue) — Lower-priority async callbacks
- **Event Loop** — The orchestrator: checks if the call stack is empty, then processes queues

### The Event Loop Algorithm (Step by Step)

```
1. Execute all synchronous code until the Call Stack is empty
2. Drain the Microtask Queue completely (process ALL microtasks)
   └── If a microtask adds more microtasks, process those too (before moving on)
3. Perform a render update (browser only, if needed)
4. Pick ONE macrotask from the Macrotask Queue and execute it
5. Go back to step 2
```

> **Critical rule:** The entire microtask queue is drained before any macrotask runs.

### Macrotasks vs Microtasks

| | **Macrotasks** | **Microtasks** |
|---|---|---|
| **Examples** | `setTimeout`, `setInterval`, `setImmediate` (Node), I/O events, UI events | `Promise.then/catch/finally`, `queueMicrotask()`, `MutationObserver` |
| **Priority** | Lower | Higher |
| **Processing** | One per event loop cycle | All drained before next macrotask |
| **Added by** | Web APIs completing their work | Promise resolutions, explicit queue |

### Execution Order Example

```js
console.log("1 — synchronous (Call Stack)");

setTimeout(() => {
  console.log("2 — macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3 — microtask (Promise.then)");
});

queueMicrotask(() => {
  console.log("4 — microtask (queueMicrotask)");
});

console.log("5 — synchronous (Call Stack)");

// Output:
// 1 — synchronous (Call Stack)
// 5 — synchronous (Call Stack)
// 3 — microtask (Promise.then)
// 4 — microtask (queueMicrotask)
// 2 — macrotask (setTimeout)
```

**Why does `setTimeout(fn, 0)` run last?** Even with 0ms delay, it's scheduled as a macrotask and only runs after all synchronous code and all microtasks.

### Nested Microtasks

Microtasks generated during microtask processing are also processed before any macrotask:

```js
Promise.resolve()
  .then(() => {
    console.log("Microtask 1");
    return Promise.resolve(); // adds another microtask
  })
  .then(() => {
    console.log("Microtask 2");
  });

setTimeout(() => console.log("Macrotask"), 0);

// Output:
// Microtask 1
// Microtask 2
// Macrotask
```

### Microtask Queue Starvation

If microtasks continuously enqueue more microtasks, macrotasks (and browser rendering) are starved:

```js
// ⚠️ WARNING: This freezes the browser tab — do NOT run this!
function infiniteMicrotask() {
  Promise.resolve().then(infiniteMicrotask);
}
infiniteMicrotask();
// The microtask queue never empties → macrotasks never run → browser freezes
```

### `async/await` and the Event Loop

`async/await` is syntactic sugar over Promises. Everything **before** the first `await` is synchronous. After `await`, the continuation is scheduled as a **microtask**.

```js
async function fetchData() {
  console.log("A — before await (synchronous)");
  const result = await Promise.resolve("fetched data");
  // Everything below is a microtask continuation
  console.log("C — after await:", result);
}

console.log("1 — start");
fetchData(); // runs synchronously until hitting 'await'
console.log("B — after fetchData() call (synchronous)");

// Output:
// 1 — start
// A — before await (synchronous)
// B — after fetchData() call (synchronous)
// C — after await: fetched data
```

### Practical Implication: Never Block the Call Stack

Long-running synchronous operations block the event loop, preventing UI updates and other async callbacks:

```js
// ❌ Blocks the event loop for ~1 second
function blockingLoop() {
  const start = Date.now();
  while (Date.now() - start < 1000) {} // busy wait
  console.log("Done blocking");
}

// ✅ Use async patterns or break work into chunks
async function nonBlocking() {
  for (let i = 0; i < 1000; i++) {
    doChunkOfWork(i);
    await new Promise(resolve => setTimeout(resolve, 0)); // yields control
  }
}
```

---

## 4. Memory Management, Garbage Collection & Memory Leaks

### The Memory Lifecycle

Every value in a JavaScript program goes through three stages:

```
1. Allocation  → Memory is reserved (variable declaration, object creation)
2. Usage       → Memory is read/written (passing variables, modifying objects)
3. Release     → Memory is freed when no longer needed
```

In languages like C, developers manually call `malloc()` and `free()`. JavaScript manages memory **automatically** through **Garbage Collection (GC)**.

### Stack vs Heap Memory

| | **Call Stack** | **Heap** |
|---|---|---|
| **Stores** | Primitive values, references, function frames | Objects, arrays, functions (reference types) |
| **Size** | Fixed, small | Dynamic, large |
| **Allocation** | Automatic (LIFO) | Automatic via GC |
| **Access Speed** | Very fast | Slower |

```js
// Primitives stored on the stack (by value)
let a = 42;
let b = a;   // b gets a COPY of 42
b = 100;
console.log(a); // 42 — unchanged

// Objects stored on the heap (by reference)
let obj1 = { name: "Alice" };
let obj2 = obj1;    // obj2 holds a REFERENCE to the same heap object
obj2.name = "Bob";
console.log(obj1.name); // "Bob" — same object!
```

### Garbage Collection: Mark-and-Sweep

The modern algorithm used by V8 (and all major engines). Works in two phases:

**Phase 1: Mark**
Starting from **GC roots** (global object, current call stack variables, registers), the engine traverses all reachable object references and marks them as "alive".

**Phase 2: Sweep**
Any memory not marked as reachable is freed.

```
GC Roots: [window, currentStack, ...]
    │
    ├── user ──► { name: "Alice", address: { city: "Lisbon" } }  ✅ reachable
    │
    └── temp ──► { data: [1, 2, 3] }  ✅ reachable

Unreachable objects: ❌ freed
```

```js
let user = { name: "Alice" }; // Object in heap, referenced by 'user'
user = null;                   // Reference removed → object is now unreachable → GC frees it
```

### Reference Counting (Legacy — Mostly Historical)

An older algorithm where each object tracks how many references point to it. When count reaches 0, it's freed.

**Critical flaw: Circular References**

```js
function createCircle() {
  let a = {};
  let b = {};
  a.ref = b; // a references b → b's ref count: 1
  b.ref = a; // b references a → a's ref count: 1
  // Function returns, local variables 'a' and 'b' are gone
  // BUT both objects still reference each other → ref count never reaches 0
  // Memory leak with reference counting!
}

createCircle();
// Modern Mark-and-Sweep handles this correctly:
// After function returns, a and b are unreachable from GC roots → freed ✅
```

> V8 uses Mark-and-Sweep, so circular references are handled correctly in modern JavaScript.

### V8 Generational Garbage Collection

V8 separates objects by age for efficiency:

```
┌─────────────────────────────────────────────┐
│           Heap Memory                       │
│                                             │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Young Generation│  │  Old Generation  │ │
│  │  (Nursery)       │  │                  │ │
│  │  Short-lived     │  │  Long-lived      │ │
│  │  objects         │  │  objects         │ │
│  │                  │  │  (survived 2+    │ │
│  │  Scavenger GC    │  │   GC cycles)     │ │
│  │  (fast, frequent)│  │                  │ │
│  │                  │  │  Mark-Sweep/     │ │
│  │                  │  │  Mark-Compact GC │ │
│  └──────────────────┘  │  (slower, rare)  │ │
│                        └──────────────────┘ │
└─────────────────────────────────────────────┘
```

- **Young Generation (Scavenger/Minor GC):** Most objects are short-lived. V8 collects them frequently and quickly using a copying algorithm.
- **Old Generation (Major GC):** Objects that survive multiple Minor GC cycles are promoted here. Collected less often but more thoroughly.

**Implication:** Creating many short-lived objects in hot paths can trigger frequent Minor GC cycles. In performance-critical code, reuse objects where possible.

### Common Memory Leaks

Memory leaks occur when memory that is no longer needed cannot be freed because references to it still exist.

#### 1. Accidental Global Variables

```js
function createLeak() {
  // Missing 'var', 'let', or 'const' → variable becomes global!
  leakyVariable = "I am now attached to window!";
}

createLeak();
console.log(window.leakyVariable); // "I am now attached to window!"
// leakyVariable lives forever on window → never GC'd

// Fix: Always use 'let', 'const', or 'var'
function safeFunction() {
  const localVariable = "I am properly scoped";
}
```

> Enable `"use strict"` to catch accidental globals: `leakyVariable = ...` throws a `ReferenceError` in strict mode.

#### 2. Forgotten Event Listeners

```js
function setupButton() {
  const button = document.getElementById("myButton");

  const handleClick = () => {
    console.log("Button clicked!");
  };

  button.addEventListener("click", handleClick);

  // If button is removed from DOM without removing the listener:
  document.body.removeChild(button);
  // ❌ The event listener (and its closure scope) is never GC'd!
}

// Fix: Remove listeners when cleaning up
function setupButtonFixed() {
  const button = document.getElementById("myButton");

  const handleClick = () => console.log("Button clicked!");
  button.addEventListener("click", handleClick);

  // When done:
  button.removeEventListener("click", handleClick); // ✅
  document.body.removeChild(button);
}

// Modern alternative: Use AbortController
function setupButtonAbortable() {
  const controller = new AbortController();
  const button = document.getElementById("myButton");

  button.addEventListener("click", () => console.log("Clicked"), {
    signal: controller.signal
  });

  // Cleanup: removes all listeners attached to this controller
  controller.abort(); // ✅
}
```

#### 3. Closures Holding Large Scopes

```js
// ❌ Leak: inner closure holds reference to the entire 'largeData' array
function createLeak() {
  const largeData = new Array(1_000_000).fill("data");

  return function query(index) {
    return largeData[index]; // 'query' keeps 'largeData' alive
  };
}

const leakyQuery = createLeak();
// 'leakyQuery' is alive → 'largeData' (1M items) is alive
// Even if we only ever call leakyQuery(0)

// ✅ Fix: extract only what you need
function createFixed() {
  const largeData = new Array(1_000_000).fill("data");
  const firstItem = largeData[0]; // extract needed value

  return function query() {
    return firstItem; // closure holds only a string, not 1M items
  };
}
```

#### 4. Detached DOM Nodes

```js
// ❌ Detached DOM node leak
let detachedNode;

function createDetachedLeak() {
  const div = document.createElement("div");
  document.body.appendChild(div);

  detachedNode = div; // save a reference

  document.body.removeChild(div); // remove from DOM...
  // ...but 'detachedNode' still references it!
  // The div is detached from the DOM but cannot be GC'd
}

// ✅ Fix: nullify the reference when done
function cleanup() {
  detachedNode = null; // now the div can be GC'd
}
```

#### 5. Timers and Intervals Not Cleared

```js
// ❌ Interval that is never cleared
function startLeakingInterval() {
  const heavyObject = new Array(100_000).fill("data");

  setInterval(() => {
    // This callback (and its closure) runs forever
    // It holds 'heavyObject' alive via the closure
    console.log(heavyObject[0]);
  }, 1000);
}

// ✅ Fix: always clear timers when done
function startManagedInterval() {
  const heavyObject = new Array(100_000).fill("data");

  const intervalId = setInterval(() => {
    console.log(heavyObject[0]);
  }, 1000);

  // When component unmounts or work is done:
  function cleanup() {
    clearInterval(intervalId); // ✅ callback and closure are now GC-eligible
  }

  return cleanup;
}
```

#### 6. Cache Without Eviction Policy

```js
// ❌ Unbounded cache — grows forever
const cache = new Map();

function processUser(userId) {
  if (!cache.has(userId)) {
    const expensiveResult = computeExpensiveResult(userId);
    cache.set(userId, expensiveResult); // added but never removed!
  }
  return cache.get(userId);
}

// ✅ Fix: Use WeakMap (GC-friendly) for object keys
const weakCache = new WeakMap();

function processUserSafe(userObject) {
  if (!weakCache.has(userObject)) {
    weakCache.set(userObject, computeExpensiveResult(userObject.id));
  }
  return weakCache.get(userObject);
  // When 'userObject' has no other references, the WeakMap entry is GC'd automatically
}
```

### WeakRef and FinalizationRegistry (Modern APIs)

ES2021 introduced `WeakRef` for holding weak references to objects:

```js
let target = { name: "Resource" };
const weakRef = new WeakRef(target);

// At any point, the object may have been GC'd
const obj = weakRef.deref();
if (obj !== undefined) {
  console.log(obj.name); // "Resource" (if not yet GC'd)
}

target = null; // Remove strong reference
// Now the object may be GC'd; weakRef.deref() will eventually return undefined
```

`FinalizationRegistry` runs a callback when an object is garbage collected:

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with key "${heldValue}" was garbage collected`);
});

let resource = { data: "important" };
registry.register(resource, "resource-1");

resource = null; // When GC runs, callback fires with "resource-1"
```

> **Note:** Do not rely on `FinalizationRegistry` for critical logic — GC timing is non-deterministic.

### Detecting Memory Leaks

**Chrome DevTools — Memory Tab:**
1. Open DevTools → Memory tab
2. Take a **Heap Snapshot** before and after suspected leak
3. Compare snapshots to identify retained objects
4. Use **Allocation Timeline** to see live allocations over time

**Performance Monitor:**
- DevTools → More Tools → Performance Monitor
- Watch **JS Heap Size** in real time

**Node.js:**
```js
// Check current memory usage
console.log(process.memoryUsage());
// {
//   rss: 30736384,       // Total process memory
//   heapTotal: 6144000,  // Total heap allocated
//   heapUsed: 4012345,   // Heap actually used
//   external: 123456     // C++ objects memory
// }
```

---

## Summary

| Concept | Key Takeaway |
|---|---|
| **V8 Engine** | Parses source → AST → Ignition bytecode → TurboFan machine code (JIT) |
| **JIT Compilation** | Type-consistent code enables faster optimized compilation |
| **Call Stack** | LIFO, single-threaded; stack overflow = infinite recursion |
| **Execution Context** | Environment per script/function; created in two phases (Creation + Execution) |
| **Hoisting** | `var` → `undefined`; `let`/`const` → TDZ; function declarations → fully hoisted |
| **Scope Chain** | Variables resolved by searching outward from current scope to global |
| **Lexical Scoping** | Scope determined by where code is written, not where it runs |
| **Event Loop** | Synchronous → All Microtasks → One Macrotask → repeat |
| **Microtasks** | `Promise.then`, `queueMicrotask` — run before any macrotask |
| **Macrotasks** | `setTimeout`, `setInterval`, I/O — one per event loop cycle |
| **GC: Mark-and-Sweep** | Marks reachable objects from roots, sweeps unreachable memory |
| **Memory Leaks** | Caused by forgotten references: globals, listeners, closures, timers, caches |

---

## Further Reading

- [V8 Blog — Official V8 engine blog](https://v8.dev/blog)
- [MDN: Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
- [MDN: Concurrency model and the Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- [JavaScript.info: Garbage Collection](https://javascript.info/garbage-collection)
- [JavaScript.info: Event Loop](https://javascript.info/event-loop)
- [Philip Roberts: "What the heck is the event loop anyway?" — JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [Jake Archibald: "In the Loop" — JSConf Asia](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- [AST Explorer — Visualize your code's AST](https://astexplorer.net)
- [Loupe — Event loop visualizer](http://latentflip.com/loupe/)
