# Chapter 6: Tooling, Debugging, and Modules

## Overview

This chapter covers the essential tools and practices that make JavaScript development professional, maintainable, and efficient. You will learn how to debug your code using browser developer tools and the console API, enforce code quality using ESLint and Prettier, and structure your code using the ES Modules system.

---

## Table of Contents

1. [Console Methods](#1-console-methods)
2. [Debugging in Browser Dev Tools](#2-debugging-in-browser-dev-tools)
3. [Linting with ESLint](#3-linting-with-eslint)
4. [Formatting with Prettier](#4-formatting-with-prettier)
5. [ES Modules: import / export](#5-es-modules-import--export)
6. [Dynamic Imports](#6-dynamic-imports)
7. [Further Reading](#further-reading)

---

## 1. Console Methods

The `console` object provides access to the browser's (and Node.js's) debugging console. It offers much more than just `console.log()`.

### `console.log()`

The most commonly used method. Outputs one or more values to the console.

```js
const user = { name: "Alice", age: 30 };
console.log("User:", user);
// Output: User: { name: 'Alice', age: 30 }

console.log("%cStyled text", "color: blue; font-size: 16px;");
// Supports CSS styling with %c placeholder
```

### `console.warn()`

Outputs a warning message, usually displayed in yellow in DevTools.

```js
function divide(a, b) {
  if (b === 0) {
    console.warn("Division by zero detected. Returning 0.");
    return 0;
  }
  return a / b;
}
```

### `console.error()`

Outputs an error message, displayed in red. Often used in catch blocks.

```js
try {
  JSON.parse("invalid json");
} catch (err) {
  console.error("Failed to parse JSON:", err.message);
}
```

### `console.table()`

Displays tabular data in a table format. Extremely useful for arrays of objects.

```js
const products = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Keyboard", price: 75 },
];

console.table(products);
// Renders a formatted table in DevTools
```

### `console.group()` and `console.groupEnd()`

Groups related log messages together so they can be collapsed/expanded in DevTools.

```js
console.group("User Authentication");
console.log("Checking credentials...");
console.log("Token validated.");
console.groupEnd();
```

### `console.groupCollapsed()`

Like `console.group()` but starts collapsed.

```js
console.groupCollapsed("Details (click to expand)");
console.log("detail 1");
console.log("detail 2");
console.groupEnd();
```

### `console.time()` and `console.timeEnd()`

Measures how long a block of code takes to execute.

```js
console.time("array-sort");
const arr = Array.from({ length: 100000 }, () => Math.random());
arr.sort((a, b) => a - b);
console.timeEnd("array-sort");
// Output: array-sort: 12.345ms
```

### `console.count()` and `console.countReset()`

Counts how many times it has been called with a given label.

```js
function processItem(type) {
  console.count(type);
}

processItem("success");
processItem("success");
processItem("error");
// Output:
// success: 1
// success: 2
// error: 1

console.countReset("success"); // resets the 'success' counter
```

### `console.assert()`

Logs a message only if a condition is `false`. Useful for lightweight assertions during development.

```js
const age = 15;
console.assert(age >= 18, "User is not an adult!", { age });
// Logs: Assertion failed: User is not an adult! { age: 15 }
```

### `console.dir()`

Displays an interactive list of an object's properties. Especially useful for DOM elements where `console.log` shows HTML markup instead.

```js
const btn = document.querySelector("button");
console.dir(btn); // Shows all DOM properties
console.log(btn); // Shows <button> HTML markup
```

### `console.trace()`

Prints a stack trace showing the call path that led to the current line.

```js
function third() { console.trace("Trace from third()"); }
function second() { third(); }
function first() { second(); }
first();
// Shows the call stack: first > second > third
```

### `console.clear()`

Clears the console output.

```js
console.clear(); // Clears all previous console output
```

---

## 2. Debugging in Browser Dev Tools

Browser Developer Tools (DevTools) are built into every modern browser. Chrome DevTools is the most widely used. Mastering DevTools is one of the most impactful skills you can develop as a frontend engineer.

### Opening DevTools

- `F12` or `Ctrl + Shift + I` (Windows/Linux)
- `Cmd + Option + I` (macOS)
- Right-click on the page → **Inspect**

### The Console Panel

- Run JavaScript interactively in the browser context.
- Inspect logged messages, errors, and warnings.
- Access global variables and DOM elements.

```js
// In the DevTools console, you can type:
document.title;              // Returns the page title
$0                           // Refers to the last inspected element
$("h1")                     // Like querySelector (in Chrome)
```

### The Sources Panel

The Sources panel is where you debug JavaScript execution.

#### Setting Breakpoints

A **breakpoint** pauses code execution at a specific line so you can inspect the state of variables at that moment.

1. Open Sources → navigate to your JS file.
2. Click on a line number to set a breakpoint (turns blue).
3. Reload the page or trigger the code path.
4. Execution pauses — you can now inspect variables, the call stack, and scope.

#### Breakpoint Types

| Type | Description |
|---|---|
| Line breakpoint | Pauses at a specific line |
| Conditional breakpoint | Pauses only when a condition is true |
| Logpoint | Logs a value without pausing execution |
| DOM breakpoint | Pauses when a DOM element changes |
| XHR/Fetch breakpoint | Pauses on network requests matching a URL |
| Event listener breakpoint | Pauses when specific DOM events fire |

#### `debugger` Statement

You can also set a breakpoint directly in your code using the `debugger` keyword.

```js
function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    debugger; // Execution pauses here when DevTools is open
    total += item.price * item.quantity;
  }
  return total;
}
```

> **Note:** Always remove `debugger` statements before committing code.

#### Stepping Through Code

While paused at a breakpoint:

| Button | Shortcut | Action |
|---|---|---|
| Resume | `F8` | Continue to next breakpoint |
| Step Over | `F10` | Execute current line, stay at same level |
| Step Into | `F11` | Jump into a function call |
| Step Out | `Shift + F11` | Exit current function |

#### Inspecting Variables

- **Scope pane**: Shows local, closure, and global variables.
- **Watch pane**: Add custom expressions to monitor.
- **Hover**: Hover over any variable in the source code to see its value.

### The Network Panel

Monitors all HTTP requests made by the page.

- Filter by type: XHR, Fetch, JS, CSS, Images.
- Inspect request/response headers and body.
- Throttle network speed to simulate slow connections.
- Copy requests as `curl` for testing in terminal.

### The Elements Panel

Inspect and live-edit HTML and CSS.

- Double-click any element to edit its HTML.
- Modify CSS properties in real-time.
- Use `$0` in the Console to reference the currently selected element.

### The Application Panel

- Inspect cookies, localStorage, sessionStorage, IndexedDB.
- Manage Service Workers.
- View Web App Manifest.

### The Performance Panel

Record and analyze runtime performance. Useful for identifying slow renders and bottlenecks.

---

## 3. Linting with ESLint

**ESLint** is a static code analysis tool that finds and fixes problems in your JavaScript code before it runs. It catches bugs, enforces coding style, and prevents anti-patterns.

### Why Linting?

- Catches errors early (undeclared variables, missing `return`, etc.)
- Enforces consistent code style across a team
- Prevents common bugs (e.g., `==` vs `===`, unused variables)
- Integrates with editors for real-time feedback

### Installing ESLint

```bash
# Initialize ESLint in your project
npm init @eslint/config@latest

# Or install manually
npm install --save-dev eslint
npx eslint --init
```

### ESLint Configuration File

ESLint uses a configuration file at the project root. Modern projects use `eslint.config.js` (flat config, ESLint v9+):

```js
// eslint.config.js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "eqeqeq": "error",         // Require === instead of ==
      "curly": "error",           // Require braces for all control flows
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];
```

Older projects use `.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "no-unused-vars": "warn",
    "eqeqeq": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}
```

### Running ESLint

```bash
# Lint all JS files
npx eslint .

# Lint a specific file
npx eslint src/app.js

# Auto-fix fixable issues
npx eslint . --fix
```

### ESLint Rule Severity Levels

| Value | Meaning |
|---|---|
| `"off"` or `0` | Disable the rule |
| `"warn"` or `1` | Report a warning (does not fail the process) |
| `"error"` or `2` | Report an error (exits with code 1) |

### Common ESLint Rules

```js
{
  "rules": {
    "no-var": "error",              // Disallow var, use let/const
    "prefer-const": "warn",         // Prefer const where possible
    "no-console": "warn",           // Flag console.log in production code
    "no-unused-vars": "warn",       // Flag declared but unused variables
    "eqeqeq": "error",              // Require === instead of ==
    "no-duplicate-imports": "error" // Disallow duplicate import statements
  }
}
```

### ESLint Plugins

ESLint is extensible via plugins for frameworks and environments:

```bash
# React plugin
npm install --save-dev eslint-plugin-react

# TypeScript support
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 4. Formatting with Prettier

**Prettier** is an opinionated code formatter. Unlike ESLint (which finds bugs), Prettier focuses solely on formatting: indentation, line length, quotes, semicolons, trailing commas, etc.

### Why Prettier?

- Eliminates formatting debates in code reviews
- Automatically formats code on save (with editor integration)
- Works with JavaScript, TypeScript, CSS, HTML, JSON, Markdown, and more
- Integrates with ESLint

### Installing Prettier

```bash
npm install --save-dev prettier
```

### Prettier Configuration

Create a `.prettierrc` file (JSON):

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "always"
}
```

Or `.prettierrc.js`:

```js
// .prettierrc.js
export default {
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  tabWidth: 2,
  printWidth: 80,
};
```

### Running Prettier

```bash
# Check what files would be changed (dry run)
npx prettier --check .

# Format all files in place
npx prettier --write .

# Format a specific file
npx prettier --write src/app.js
```

### `.prettierignore`

Exclude files from formatting:

```
node_modules/
dist/
build/
*.min.js
```

### Prettier + ESLint Together

Using both tools together is the industry standard. Use `eslint-config-prettier` to disable ESLint formatting rules that conflict with Prettier:

```bash
npm install --save-dev eslint-config-prettier
```

```js
// eslint.config.js
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier, // Must be last — disables conflicting ESLint formatting rules
  {
    rules: {
      "no-unused-vars": "warn",
      "eqeqeq": "error",
    },
  },
];
```

### Editor Integration

In VS Code, install the **ESLint** and **Prettier** extensions, then add to your settings:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## 5. ES Modules: import / export

**ES Modules** (ESM) is the official JavaScript module system, introduced in ES2015. Modules allow you to split your code into reusable files with clear, explicit dependencies.

### Why Modules?

Before ESM, JavaScript had no native module system. Developers used IIFEs, CommonJS (Node.js), or AMD. ES Modules are now the standard for both browsers and Node.js.

Benefits:
- **Encapsulation**: Variables are scoped to the module, not global.
- **Reusability**: Share code across files without duplication.
- **Dependency clarity**: Explicit imports make dependencies obvious.
- **Tree shaking**: Bundlers can eliminate unused exports from the final bundle.

### Named Exports

A module can export multiple named values.

```js
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```js
// app.js
import { PI, add, multiply } from "./math.js";

console.log(PI);           // 3.14159
console.log(add(2, 3));    // 5
console.log(multiply(4, 5)); // 20
```

### Default Exports

A module can have one default export, which can be imported with any name.

```js
// greet.js
export default function greet(name) {
  return `Hello, ${name}!`;
}
```

```js
// app.js
import greet from "./greet.js";

console.log(greet("Alice")); // Hello, Alice!
```

### Named + Default Exports in the Same Module

```js
// logger.js
export const LOG_LEVEL = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
};

export default class Logger {
  constructor(level) {
    this.level = level;
  }

  log(message) {
    console.log(`[${this.level.toUpperCase()}] ${message}`);
  }
}
```

```js
// app.js
import Logger, { LOG_LEVEL } from "./logger.js";

const logger = new Logger(LOG_LEVEL.INFO);
logger.log("Application started"); // [INFO] Application started
```

### Renaming Imports and Exports

```js
// math.js
export { add as sum, multiply as product };
```

```js
// app.js
import { sum, product } from "./math.js";

// Or rename on import:
import { add as addition } from "./math.js";
```

### Namespace Import (Import All)

Import everything from a module under a single namespace object.

```js
import * as MathUtils from "./math.js";

console.log(MathUtils.PI);          // 3.14159
console.log(MathUtils.add(1, 2));   // 3
```

### Re-exporting

A module can re-export from another module. This is useful for creating "barrel" files (index.js) that aggregate exports.

```js
// utils/index.js — barrel file
export { add, multiply } from "./math.js";
export { default as Logger } from "./logger.js";
export * from "./validators.js";
```

```js
// app.js — import from one place
import { add, Logger } from "./utils/index.js";
```

### Using Modules in the Browser

Add `type="module"` to your `<script>` tag. Without it, `import`/`export` will throw a `SyntaxError`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ES Modules Demo</title>
</head>
<body>
  <!-- type="module" enables ES Module syntax -->
  <script type="module" src="app.js"></script>
</body>
</html>
```

#### Key Differences When Using `type="module"`

| Feature | Regular `<script>` | `type="module"` |
|---|---|---|
| Scope | Global | Module scope |
| `"use strict"` | Optional | Always strict mode |
| `import`/`export` | Not available | Available |
| Deferred by default | No | Yes |
| CORS required | No | Yes (for cross-origin) |

### Modules in Node.js

Node.js supports ESM natively in two ways:

1. Use `.mjs` file extension.
2. Add `"type": "module"` to `package.json`.

```json
// package.json
{
  "type": "module"
}
```

```js
// utils.mjs (or any .js file when "type": "module" is set)
export const greet = (name) => `Hello, ${name}!`;
```

---

## 6. Dynamic Imports

Standard `import` statements are **static**: they are resolved at parse time, before any code runs. **Dynamic imports** use `import()` as a function and return a Promise, allowing you to load modules on demand.

### Syntax

```js
// Dynamic import returns a Promise
const module = await import("./module.js");
module.someFunction();
```

Or with `.then()`:

```js
import("./module.js").then((module) => {
  module.someFunction();
});
```

### Why Use Dynamic Imports?

- **Code splitting**: Load only the code needed for the current page/route.
- **Lazy loading**: Defer loading heavy modules until they are needed.
- **Conditional loading**: Load different modules based on runtime conditions.

### Example: Lazy Loading a Feature

```js
// The `analytics.js` module is only loaded when the user clicks the button
const button = document.getElementById("run-analytics");

button.addEventListener("click", async () => {
  const { runAnalytics } = await import("./analytics.js");
  runAnalytics();
});
```

### Example: Conditional Module Loading

```js
async function loadTheme(themeName) {
  const theme = await import(`./themes/${themeName}.js`);
  theme.apply();
}

loadTheme("dark");   // Loads ./themes/dark.js
loadTheme("light");  // Loads ./themes/light.js
```

> **Note:** Dynamic `import()` with template literals (as above) can be a security risk if `themeName` comes from user input. Always validate and whitelist such values.

### Example: Route-Based Code Splitting (Framework Pattern)

In React Router (and similar frameworks), dynamic imports enable route-based code splitting:

```js
// Plain JS example showing the pattern
async function loadPage(route) {
  let module;

  if (route === "/home") {
    module = await import("./pages/HomePage.js");
  } else if (route === "/about") {
    module = await import("./pages/AboutPage.js");
  } else {
    module = await import("./pages/NotFoundPage.js");
  }

  module.default.render();
}
```

### Top-Level `await` (ES2022)

In module files (not regular scripts), you can use `await` at the top level — outside of any `async` function.

```js
// config.js (a module file)
const response = await fetch("/api/config");
const config = await response.json();

export { config };
```

```js
// app.js
import { config } from "./config.js";
// 'config' is fully resolved before this module runs
console.log(config.apiUrl);
```

---

## Summary

| Topic | Key Takeaway |
|---|---|
| Console methods | Use the full range — `table`, `group`, `time`, `assert` — not just `log` |
| Browser DevTools | Breakpoints and the Sources panel are your primary debugging tools |
| ESLint | Catches bugs and enforces code quality rules statically |
| Prettier | Handles formatting automatically so you never argue about style |
| ES Modules | Native module system with `import`/`export`; always use `type="module"` in HTML |
| Dynamic imports | Load modules on demand for better performance and code splitting |

---

## Further Reading

- [MDN: Console API](https://developer.mozilla.org/en-US/docs/Web/API/console)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [MDN: ES Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN: Dynamic import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
