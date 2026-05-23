# Module 3: JavaScript

## Overview

This module provides a comprehensive journey through JavaScript — from the foundational building blocks every developer needs, through DOM manipulation and asynchronous programming, up to advanced engine internals, design patterns, and browser performance APIs. The module is structured to take a complete beginner from zero knowledge of JavaScript to a senior-level understanding of how the language works under the hood.

The first six chapters cover core JavaScript for everyday development. Chapters 7–11 are marked **Advanced** and address the mechanics, patterns, and performance optimizations that distinguish senior engineers from mid-level ones.

---

## Learning Objectives

By the end of this module you will be able to:

- Write idiomatic JavaScript using modern ES6+ syntax
- Control program flow with conditionals, loops, and well-structured functions
- Model data with objects and arrays, applying destructuring and functional iteration methods
- Manipulate the DOM and respond to user events to build interactive web interfaces
- Handle asynchronous operations with callbacks, Promises, and async/await
- Work with real HTTP APIs using the Fetch API, including proper error handling and CORS awareness
- Use professional tooling: browser DevTools, ESLint, Prettier, and ES Modules
- Explain how the V8 engine parses, compiles, and optimizes JavaScript code
- Describe the event loop and differentiate between microtasks and macrotasks
- Apply prototypal inheritance, closures, iterators, and generators with confidence
- Implement advanced async patterns including streams, WebSockets, and SSE
- Recognize and apply common OOP and functional design patterns
- Leverage browser APIs — Web Workers, Service Workers, IndexedDB, and Performance APIs — to build resilient, high-performance applications

---

## Prerequisites

- Module 1: HTML & Web Standards (recommended)
- Module 2: CSS & Styling Architecture (optional but helpful for DOM-related chapters)
- A modern browser (Chrome or Firefox) and a text editor or IDE

---

## Chapters

### Chapter 1: JS Basics
> **Folder:** `chapter-1-js-basics/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Introduces JavaScript as a language — its history, standardization (ECMAScript), and the many environments where it runs (browsers, Node.js, mobile, desktop, edge). Covers the syntax fundamentals every developer uses every day.

**Topics:**
- What is JavaScript? History, ECMAScript, and where it runs
- Variables: `var`, `let`, `const`, and block/function scope
- Data types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- Operators: arithmetic, assignment, comparison, logical, ternary

**Learning Objectives:**
- Explain the role of JavaScript in the web stack alongside HTML and CSS
- Correctly choose between `var`, `let`, and `const` for variable declarations
- Identify and work with all seven primitive data types
- Use arithmetic, comparison, and logical operators to build expressions

**Examples:**
- `example-01-what-is-javascript/` — JavaScript environments and script inclusion patterns
- `example-02-variables-and-scope/` — `var` vs `let` vs `const`, hoisting basics
- `example-03-data-types/` — Primitive types, `typeof`, type coercion
- `example-04-operators/` — Arithmetic, comparison, logical, and ternary operators

---

### Chapter 2: Control Flow and Functions
> **Folder:** `chapter-2-control-flow-and-functions/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Covers the three pillars that allow dynamic, reusable programs: conditionals to branch logic, loops to repeat operations, and functions to encapsulate behaviour. Also explores scope, hoisting, and closures — three of the most important and frequently misunderstood concepts in JavaScript.

**Topics:**
- Conditionals: `if / else if / else`, `switch`, truthy/falsy values
- Loops: `for`, `while`, `do-while`, `for...of`, `for...in`
- Functions: declarations, expressions, arrow functions, parameters, `return`
- Default parameters, rest parameters, and the spread operator
- Scope (block, function, global), hoisting, and closures

**Learning Objectives:**
- Write conditional logic using `if / else if / else` and `switch`
- Choose the appropriate loop construct for each use case
- Declare functions using declarations, expressions, and arrow syntax
- Use default, rest, and spread parameter patterns
- Explain lexical scope and variable hoisting behaviour
- Understand closures and write practical examples that leverage them

**Examples:**
- `example-01-conditionals/` — `if/else`, `switch`, truthy/falsy
- `example-02-loops/` — `for`, `while`, `for...of`, `for...in`
- `example-03-functions/` — Declarations, expressions, arrow functions, parameters
- `example-04-scope-and-hoisting/` — Block scope, `var` hoisting, temporal dead zone
- `example-05-closures/` — Closure patterns, factory functions, data encapsulation

---

### Chapter 3: Objects and Arrays
> **Folder:** `chapter-3-objects-and-arrays/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Introduces the two fundamental compound data structures in JavaScript. Objects model real-world entities with named properties, while arrays represent ordered collections. The chapter also covers ES6+ features — destructuring, spread, and rest — that make working with these structures more expressive and concise.

**Topics:**
- Creating and using objects with literal syntax
- Property access (dot and bracket notation), mutation, deletion
- Object methods and the `this` keyword
- Utility methods: `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.assign()`, `Object.freeze()`
- Arrays: creation and mutating methods (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`)
- Non-mutating methods: `slice`, `concat`, `join`, `indexOf`, `includes`
- Iteration methods: `forEach`, `map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`
- Destructuring (arrays, objects, nested, with defaults)
- Spread and rest with objects and arrays

**Learning Objectives:**
- Create and manipulate objects using object literal syntax
- Write object methods and explain how `this` behaves inside them
- Choose correctly between mutating and non-mutating array methods
- Use `map`, `filter`, and `reduce` for data transformation pipelines
- Apply array and object destructuring, including nested patterns
- Clone and merge objects/arrays with the spread operator

**Examples:**
- `example-01-objects/` — Object literals, property access, methods, `this`
- `example-02-arrays/` — Array creation, mutating methods
- `example-03-array-iteration-methods/` — `map`, `filter`, `reduce`, `find`, `some`, `every`
- `example-04-destructuring/` — Array and object destructuring with defaults
- `example-05-spread-and-rest/` — Spread for cloning/merging, rest in destructuring

---

### Chapter 4: The DOM and Events
> **Folder:** `chapter-4-dom-and-events/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Explains the Document Object Model — the browser's live, tree-structured representation of an HTML page — and how JavaScript uses the DOM API to read, modify, create, and delete content dynamically. Covers the event system that connects user interactions to JavaScript logic.

**Topics:**
- The DOM tree and node types (`Element`, `Text`, `Comment`, `Document`)
- Selecting elements: `getElementById`, `querySelector`, `querySelectorAll`
- Reading and modifying content (`textContent`, `innerHTML`) and attributes
- Creating, inserting, and removing elements
- Event handling: `addEventListener`, the event object, propagation
- Event delegation for efficient handling of dynamic content
- Forms and input events (`input`, `change`, `submit`, `focus`, `blur`)

**Learning Objectives:**
- Visualize the DOM tree and understand the relationships between nodes
- Select single and multiple DOM elements using various query methods
- Read, update, and remove element content and attributes
- Dynamically create and insert new elements into the page
- Attach and manage event listeners correctly
- Apply event delegation to handle events on dynamically added elements
- Capture and process form input events

**Examples:**
- `01-dom-tree-and-selectors/` — Node types, `querySelector`, `querySelectorAll`
- `02-reading-modifying-content-attributes/` — `textContent`, `innerHTML`, `setAttribute`
- `03-creating-inserting-removing-elements/` — `createElement`, `appendChild`, `remove`
- `04-event-handling/` — `addEventListener`, event object, propagation, `stopPropagation`
- `05-event-delegation/` — Delegated event handling on parent containers
- `06-forms-and-input-events/` — Form validation, input events, `submit` handling

---

### Chapter 5: Asynchronous JavaScript
> **Folder:** `chapter-5-asynchronous-javascript/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Covers the full evolution of async JavaScript — from callback-based patterns to Promises and the async/await syntax — along with practical use of the Fetch API for HTTP communication. Includes a foundational mental model of the JavaScript event loop to explain *why* async patterns are necessary.

**Topics:**
- The single-threaded model and the event loop (mental model)
- Callbacks and callback hell (pyramid of doom)
- Promises: creation, chaining (`.then()`, `.catch()`, `.finally()`), error handling
- `Promise.all`, `Promise.race`, `Promise.allSettled`, `Promise.any`
- Async/await syntax and error handling with `try/catch`
- Fetch API: GET and POST requests, working with JSON
- Error handling, CORS, and practical API consumption patterns

**Learning Objectives:**
- Describe the JavaScript event loop and explain why async code is needed
- Write and consume callback-based async code
- Create Promises and chain them correctly
- Handle multiple concurrent Promises with `Promise.all` and `Promise.allSettled`
- Convert Promise chains to async/await and handle errors with `try/catch`
- Make GET and POST requests with the Fetch API
- Handle CORS restrictions and API error responses gracefully

**Examples:**
- `01-callbacks/` — Callback patterns, error-first callbacks, callback hell
- `02-promises/` — Creating Promises, chaining, `Promise.all`, `Promise.race`
- `03-async-await/` — Converting Promise chains, `try/catch`, sequential vs concurrent
- `04-fetch-api/` — GET and POST requests, JSON parsing, status code handling
- `05-working-with-apis/` — Consuming a public API end-to-end with error handling and CORS

---

### Chapter 6: Tooling, Debugging, and Modules
> **Folder:** `chapter-6-tooling-debugging-and-modules/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Introduces the professional developer workflow: using the console API for structured debugging, leveraging browser DevTools to inspect and step through code, enforcing code quality with ESLint and Prettier, and structuring applications using the ES Modules system.

**Topics:**
- Console methods: `log`, `warn`, `error`, `table`, `group`, `time`, `assert`, `dir`
- Debugging in browser DevTools: breakpoints, call stack, watch expressions, network panel
- Linting with ESLint: configuration, rule sets, and fixing violations
- Formatting with Prettier: opinionated code style and editor integration
- ES Modules: named and default `export`, `import`, `script type="module"`
- Dynamic imports (`import()`) for lazy loading

**Learning Objectives:**
- Use advanced console methods for structured, informative debug output
- Set breakpoints and step through code in browser DevTools
- Configure and run ESLint to catch errors and enforce code style
- Set up Prettier for automatic code formatting
- Organize code into ES Modules using named and default exports
- Implement dynamic imports for on-demand code splitting

**Examples:**
- `01-console-methods/` — `log`, `warn`, `error`, `table`, `group`, `time`
- `02-devtools-debugging/` — Breakpoints, step-through, call stack inspection
- `03-eslint-prettier-setup/` — ESLint and Prettier config for a JS project
- `04-es-modules/` — Named exports, default exports, import aliases, `type="module"`
- `05-dynamic-imports/` — `import()` for lazy loading code on demand

---

### Chapter 7: The JavaScript Engine & Execution *(Advanced)*
> **Folder:** `chapter-7-js-engine-&-execution/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
A deep dive into how JavaScript is actually executed — from source code to optimized machine code inside the V8 engine. Covers execution contexts, the scope chain, the event loop's microtask and macrotask queues, and how memory is managed to avoid leaks.

**Topics:**
- V8 engine pipeline: Parser → AST → Ignition (bytecode) → TurboFan (JIT)
- The Call Stack and execution frames
- Execution Context (Global, Function, Eval) and the `[[Environment]]` record
- Hoisting in depth: variable declarations, function declarations, TDZ
- Scope chains and closure memory
- The Event Loop: microtask queue (Promises) vs macrotask queue (`setTimeout`)
- Memory management, garbage collection (mark-and-sweep), and common memory leaks

**Learning Objectives:**
- Trace the path a JavaScript source file takes from parsing to execution
- Explain what the call stack is and how execution frames are pushed and popped
- Describe execution contexts and how the scope chain is resolved
- Predict hoisting behaviour for `var`, `let`, `const`, and function declarations
- Explain the order of execution between synchronous code, microtasks, and macrotasks
- Identify and fix common memory leak patterns in JavaScript applications

**Examples:**
- `01-call-stack-visualization/` — Simulating stack frames and stack overflow
- `02-jit-compilation-type-consistency/` — Writing JIT-friendly code by maintaining type consistency
- `03-execution-context-hoisting/` — Execution context creation phases, hoisting order
- `04-scope-chain/` — Lexical scope lookup, closures and the scope chain
- `05-event-loop-microtasks-macrotasks/` — Execution order: sync → microtasks → macrotasks
- `06-memory-leaks-and-fixes/` — Identifying and eliminating common memory leaks

---

### Chapter 8: Advanced Language Mechanics *(Advanced)*
> **Folder:** `chapter-8-advanced-language-mechanics/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Explores the most powerful and frequently misunderstood mechanics of JavaScript: the dynamic `this` binding rules, the prototype chain that underpins all objects, closures in stateful design, and the iterator/generator protocol that enables lazy sequences and custom iteration.

**Topics:**
- `this` binding rules: default, implicit, explicit (`call`, `apply`, `bind`), `new`
- Arrow functions and lexical `this`
- Prototypes and the prototype chain (`[[Prototype]]`, `Object.getPrototypeOf`)
- Prototypal inheritance vs. ES6 `class` syntactic sugar
- Polymorphism, `super`, and method overriding
- Closures: practical applications (module pattern, memoization, partial application)
- Iterators: the Iterator Protocol (`next()`, `value`, `done`)
- Generators (`function*`, `yield`, lazy sequences)
- Well-known Symbols (`Symbol.iterator`, `Symbol.toPrimitive`, etc.)

**Learning Objectives:**
- Apply the four `this` binding rules to determine `this` in any context
- Use `call`, `apply`, and `bind` to explicitly control `this`
- Trace the prototype chain to understand property lookup
- Implement inheritance using both prototype-based and class-based approaches
- Use closures to create private state and factory functions
- Implement the Iterator Protocol and write custom iterables
- Write generator functions to produce lazy, on-demand sequences

**Examples:**
- `01-this-binding-rules/` — Default, implicit, explicit, and `new` binding
- `02-call-apply-bind/` — Borrowing methods, partial application with `bind`
- `03-prototypes-inheritance/` — Prototype chain, `Object.create()`, property shadowing
- `04-es6-classes-polymorphism/` — `class`, `extends`, `super`, polymorphic method dispatch
- `05-closures/` — Module pattern, memoization, counter factories
- `06-iterators/` — Custom iterator protocol implementation
- `07-generators/` — `function*`, `yield`, infinite sequences, early return
- `08-symbols/` — Well-known Symbols and custom `Symbol.iterator`
- `09-capstone-observable-store/` — Combining closures, iterators, and Symbols into an observable state store

---

### Chapter 9: Advanced Asynchronous Patterns *(Advanced)*
> **Folder:** `chapter-9-advanced-async-patterns/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Dissects Promises at the implementation level, then builds on that foundation to address complex real-world async scenarios: concurrent workflows, cancellation, back-pressure with Streams, and live connections via WebSockets, Server-Sent Events, and WebRTC.

**Topics:**
- The Promise state machine (Pending → Fulfilled/Rejected), resolution procedure
- Microtask queue scheduling of `.then()` / `.catch()` / `.finally()`
- Building a spec-compliant `MyPromise` from scratch
- Advanced `async/await`: sequential vs concurrent execution, `Promise.all` patterns
- Concurrency control (limiting parallel requests), error boundaries
- Streams API: `ReadableStream`, `WritableStream`, `TransformStream`, piping, back-pressure
- `AbortController` and `AbortSignal` for cancellation
- WebSockets: full-duplex communication, reconnect strategies
- Server-Sent Events (SSE): unidirectional server push
- WebRTC basics: peer connections, ICE, signalling

**Learning Objectives:**
- Explain the internal state transitions of a Promise
- Build a minimal Promise implementation from the Promises/A+ specification
- Orchestrate multiple concurrent async operations with controlled parallelism
- Cancel in-flight operations with `AbortController`
- Stream large data sets without buffering entire responses in memory
- Choose the appropriate real-time transport (WebSocket vs SSE vs WebRTC) for a given use case
- Implement a WebSocket client with reconnection logic

**Examples:**
- `01-custom-promise-implementation/` — Building `MyPromise` from scratch
- `02-advanced-async-await-patterns/` — Sequential, concurrent, rate-limited async flows
- `03-streams-api-and-abortcontroller/` — Piping streams, back-pressure, cancellation
- `04-websockets/` — WebSocket client/server, heartbeat, reconnect
- `05-server-sent-events/` — EventSource API, SSE server setup
- `06-webrtc-basics/` — Peer connection, ICE candidates, signalling flow

---

### Chapter 10: Design Patterns & Paradigms *(Advanced)*
> **Folder:** `chapter-10-design-patterns-paradigms/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Introduces the major programming paradigms and proven design patterns used in professional JavaScript development. Covers Gang of Four OOP patterns adapted to JavaScript, functional programming principles, reactive programming with RxJS, and the evolution of JavaScript module formats.

**Topics:**
- **OOP patterns** — Creational (Singleton, Factory, Builder, Prototype), Structural (Decorator, Adapter, Facade, Proxy), Behavioral (Observer, Strategy, Command, Iterator)
- **Functional Programming** — Pure functions, immutability, currying, function composition, `pipe` / `compose`
- **Reactive Programming** — Observable pattern, RxJS basics (Observables, Operators, Subjects)
- **Modularity Patterns** — IIFE, Revealing Module, UMD, CommonJS (`require`/`module.exports`), ESM

**Learning Objectives:**
- Recognize and implement Creational, Structural, and Behavioral design patterns in JavaScript
- Write pure functions and reason about immutability
- Compose complex transformations from small, reusable functions using currying and composition
- Understand the reactive programming model and use RxJS Observables for event streams
- Explain the differences between IIFE, CommonJS, UMD, and ESM module formats

**Examples:**
- `01-creational-patterns/` — Singleton, Factory Method, Builder, Prototype
- `02-structural-patterns/` — Decorator, Adapter, Facade, Proxy
- `03-behavioral-patterns/` — Observer, Strategy, Command, Iterator
- `04-functional-programming/` — Pure functions, immutability, curry, compose, pipe
- `05-reactive-programming/` — RxJS Observables, operators (`map`, `filter`, `mergeMap`), Subjects
- `06-modularity-patterns/` — IIFE, Revealing Module, CommonJS, UMD, ESM side-by-side

---

### Chapter 11: Browser Capabilities & Performance *(Advanced)*
> **Folder:** `chapter-11-browser-capabilities-performance/` | **Theory:** `theory.md` | **Examples:** `examples/`

**Overview:**
Explores the browser APIs that go beyond rendering HTML — enabling background computation, offline capability, persistent client-side storage, precise performance measurement, and optimized event management. These capabilities are essential for building production-grade web applications.

**Topics:**
- **Web Workers** — Dedicated threads for CPU-intensive work, `postMessage`, `onmessage`
- **Service Workers** — Network proxy, caching strategies, offline capability, background sync
- **IndexedDB** — Structured client-side storage, transactions, indexes, cursors
- **Client-side Storage Architecture** — `localStorage`, `sessionStorage`, `IndexedDB`, Cache API comparison
- **Performance APIs** — Navigation Timing, Resource Timing, `PerformanceObserver`, User Timing (`performance.mark`, `performance.measure`)
- **Event Management** — Debounce, throttle, passive event listeners, advanced event delegation

**Learning Objectives:**
- Offload CPU-intensive work to a Web Worker to keep the UI thread responsive
- Register and control a Service Worker to enable offline functionality and intelligent caching
- Store and query structured data in IndexedDB using transactions
- Choose the appropriate client-side storage mechanism for a given use case
- Measure real-world page performance using the Navigation Timing and Resource Timing APIs
- Implement debounce and throttle to limit the frequency of expensive event handlers
- Use passive event listeners to improve scroll and touch performance

**Examples:**
- `example-01-web-worker/` — Offloading computation, `postMessage` communication
- `example-02-service-worker/` — Service Worker lifecycle, cache-first strategy, offline fallback
- `example-03-indexeddb/` — Opening a database, transactions, CRUD with indexes
- `example-04-performance-apis/` — `PerformanceObserver`, `performance.mark`, Navigation Timing
- `example-05-debounce-throttle/` — Implementing debounce and throttle from scratch
- `example-06-event-delegation/` — Advanced delegation patterns, passive listeners

---

## Mini-Projects

| Project | Folder | Concepts Practised |
|---|---|---|
| **Data Dashboard with Public API** | `mini-projects/data-dashboard-with-public-API/` | Fetch API, async/await, DOM manipulation, event handling, error handling |
| **Custom Promise Class from Scratch** | `mini-projects/implement-a-custom-promise-class-from-scratch/` | Promises internals, state machines, microtask queue, async patterns |

---

## Module Structure

```
module-3-javascript/
├── README.md                                    ← This file
├── chapter-1-js-basics/
│   ├── theory.md
│   └── examples/
│       ├── example-01-what-is-javascript/
│       ├── example-02-variables-and-scope/
│       ├── example-03-data-types/
│       └── example-04-operators/
├── chapter-2-control-flow-and-functions/
│   ├── theory.md
│   └── examples/
│       ├── example-01-conditionals/
│       ├── example-02-loops/
│       ├── example-03-functions/
│       ├── example-04-scope-and-hoisting/
│       └── example-05-closures/
├── chapter-3-objects-and-arrays/
│   ├── theory.md
│   └── examples/
│       ├── example-01-objects/
│       ├── example-02-arrays/
│       ├── example-03-array-iteration-methods/
│       ├── example-04-destructuring/
│       └── example-05-spread-and-rest/
├── chapter-4-dom-and-events/
│   ├── theory.md
│   └── examples/
│       ├── 01-dom-tree-and-selectors/
│       ├── 02-reading-modifying-content-attributes/
│       ├── 03-creating-inserting-removing-elements/
│       ├── 04-event-handling/
│       ├── 05-event-delegation/
│       └── 06-forms-and-input-events/
├── chapter-5-asynchronous-javascript/
│   ├── theory.md
│   └── examples/
│       ├── 01-callbacks/
│       ├── 02-promises/
│       ├── 03-async-await/
│       ├── 04-fetch-api/
│       └── 05-working-with-apis/
├── chapter-6-tooling-debugging-and-modules/
│   ├── theory.md
│   └── examples/
│       ├── 01-console-methods/
│       ├── 02-devtools-debugging/
│       ├── 03-eslint-prettier-setup/
│       ├── 04-es-modules/
│       └── 05-dynamic-imports/
├── chapter-7-js-engine-&-execution/             ← Advanced
│   ├── theory.md
│   └── examples/
│       ├── 01-call-stack-visualization/
│       ├── 02-jit-compilation-type-consistency/
│       ├── 03-execution-context-hoisting/
│       ├── 04-scope-chain/
│       ├── 05-event-loop-microtasks-macrotasks/
│       └── 06-memory-leaks-and-fixes/
├── chapter-8-advanced-language-mechanics/       ← Advanced
│   ├── theory.md
│   └── examples/
│       ├── 01-this-binding-rules/
│       ├── 02-call-apply-bind/
│       ├── 03-prototypes-inheritance/
│       ├── 04-es6-classes-polymorphism/
│       ├── 05-closures/
│       ├── 06-iterators/
│       ├── 07-generators/
│       ├── 08-symbols/
│       └── 09-capstone-observable-store/
├── chapter-9-advanced-async-patterns/           ← Advanced
│   ├── theory.md
│   └── examples/
│       ├── 01-custom-promise-implementation/
│       ├── 02-advanced-async-await-patterns/
│       ├── 03-streams-api-and-abortcontroller/
│       ├── 04-websockets/
│       ├── 05-server-sent-events/
│       └── 06-webrtc-basics/
├── chapter-10-design-patterns-paradigms/        ← Advanced
│   ├── theory.md
│   └── examples/
│       ├── 01-creational-patterns/
│       ├── 02-structural-patterns/
│       ├── 03-behavioral-patterns/
│       ├── 04-functional-programming/
│       ├── 05-reactive-programming/
│       └── 06-modularity-patterns/
├── chapter-11-browser-capabilities-performance/ ← Advanced
│   ├── theory.md
│   └── examples/
│       ├── example-01-web-worker/
│       ├── example-02-service-worker/
│       ├── example-03-indexeddb/
│       ├── example-04-performance-apis/
│       ├── example-05-debounce-throttle/
│       └── example-06-event-delegation/
└── mini-projects/
    ├── data-dashboard-with-public-API/
    └── implement-a-custom-promise-class-from-scratch/
```

---

## Further Reading

- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [ECMAScript Specification (TC39)](https://tc39.es/ecma262/)
- [JavaScript.info — The Modern JavaScript Tutorial](https://javascript.info/)
- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
- [V8 Blog — Engine internals](https://v8.dev/blog)
