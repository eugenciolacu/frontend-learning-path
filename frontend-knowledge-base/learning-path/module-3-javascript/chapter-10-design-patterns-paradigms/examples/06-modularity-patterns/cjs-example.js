// ============================================================
// CommonJS Example (Node.js)
// ============================================================
// This file is for reference/documentation purposes.
// It cannot run in the browser (CJS is Node.js only).
// Run with: node cjs-example.js
// ============================================================

// ── EXPORTING ──

// Method 1: assign to module.exports (replaces entire exports object)
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
const PI = 3.14159;

module.exports = { add, subtract, PI };

// Method 2: add individual properties to exports shorthand
// (Can be mixed, but don't mix with module.exports = {} in same file)
// exports.multiply = (a, b) => a * b;


// ── IMPORTING ──

// Destructured import (like named imports in ESM)
const { add: addFn, PI: piValue } = require('./cjs-math');

// Whole module import
const mathLib = require('./cjs-math');

// Dynamic require (resolved at runtime, not compile time)
const env = process.env.NODE_ENV ?? 'development';
const logger = require(`./loggers/${env}-logger`);

// Built-in Node.js modules
const path = require('path');
const fs = require('fs');
const { readFile } = require('fs/promises');

// Third-party package
const express = require('express');


// ── HOW NODE.JS WRAPS MODULES ──
// Every CJS module is automatically wrapped in this function:
//
// (function(exports, require, module, __filename, __dirname) {
//   // Your module code here
// });
//
// This is why:
//  - `exports`, `require`, `module` are available without declaration
//  - `__filename` and `__dirname` exist
//  - Variables declared at top level are NOT global (they're in function scope)


// ── CJS vs ESM AT A GLANCE ──
//
// CommonJS:
//   require()         → synchronous, can be called anywhere
//   module.exports    → export what you want
//   exports shorthand → same as module.exports properties
//   No tree shaking   → bundlers cannot remove unused parts
//   Runtime loading   → modules loaded when require() runs
//
// ESM:
//   import { x }      → static, hoisted, must be at top level
//   import()          → dynamic, returns a Promise
//   export {}         → named exports
//   export default    → one default per module
//   Tree shakeable    → bundlers can eliminate dead code
//   Compile-time      → imports resolved before code runs
//
// Node.js dual-package support (CJS + ESM):
// {
//   "exports": {
//     ".": {
//       "import": "./dist/index.mjs",   // ESM
//       "require": "./dist/index.cjs"   // CJS
//     }
//   }
// }

console.log('This is a CJS reference file. Run with: node cjs-example.js');
console.log('For browser-compatible modules, see esm-main.js and esm-math.js');
