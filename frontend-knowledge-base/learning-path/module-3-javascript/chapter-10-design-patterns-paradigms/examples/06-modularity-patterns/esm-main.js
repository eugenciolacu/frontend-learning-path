// ============================================================
// ESM MAIN — Entry point demonstrating ES Module imports
// ============================================================
// This file uses type="module" (set in index.html).
// It imports from other .js files using static import syntax.
//
// Key ESM features demonstrated:
//  - Named imports: import { add, PI } from './esm-math.js'
//  - Default import: import formatNumber from './esm-math.js'
//  - Namespace import: import * as Strings from './esm-strings.js'
//  - Re-export aggregation pattern
//  - Dynamic import() for lazy loading
// ============================================================

// Named imports — only import what you need (tree-shakeable!)
import { add, subtract, multiply, divide, clamp, MathUtils, PI } from './esm-math.js';

// Default import (formatNumber is the default export)
import formatNumber from './esm-math.js';

// Rename on import with 'as'
import { capitalize as cap, toSlug, truncate, countWords } from './esm-strings.js';

// Namespace import — access all exports as properties
import * as Strings from './esm-strings.js';

const lines = [];

lines.push('=== ESM — Named Imports (esm-math.js) ===');
lines.push(`PI = ${PI}`);
lines.push(`add(10, 5)      = ${add(10, 5)}`);
lines.push(`subtract(10, 5) = ${subtract(10, 5)}`);
lines.push(`multiply(4, 7)  = ${multiply(4, 7)}`);
lines.push(`divide(100, 4)  = ${divide(100, 4)}`);
lines.push(`clamp(150, 0, 100) = ${clamp(150, 0, 100)}`);

lines.push('\n--- MathUtils ---');
const scores = [85, 92, 78, 95, 88];
lines.push(`Scores:  [${scores}]`);
lines.push(`Average: ${formatNumber(MathUtils.average(scores))}`); // default export used here
lines.push(`Max:     ${MathUtils.max(scores)}`);
lines.push(`Min:     ${MathUtils.min(scores)}`);
lines.push(`Sum:     ${MathUtils.sum(scores)}`);

lines.push('\n=== ESM — Named Imports (esm-strings.js) ===');
lines.push(`capitalize("hello world") = "${cap('hello world')}"`);
lines.push(`toSlug("My Blog Post!")   = "${toSlug('My Blog Post!')}"`);
lines.push(`truncate("...") = "${truncate('The quick brown fox jumps over the lazy dog', 30)}"`);
lines.push(`countWords("Hello World") = ${countWords('Hello World')}`);

lines.push('\n--- Namespace import (import * as Strings) ---');
lines.push(`Strings.capitalize("test") = "${Strings.capitalize('test')}"`);
lines.push(`Strings.toSlug("Hello ES Modules") = "${Strings.toSlug('Hello ES Modules')}"`);

// Error handling within module
lines.push('\n--- Error boundary within module ---');
try {
  divide(10, 0);
} catch (e) {
  lines.push(`divide(10, 0) → ${e.constructor.name}: ${e.message}`);
}

// Dynamic import — loads a module lazily (only when needed)
lines.push('\n=== Dynamic import() — lazy loading ===');
lines.push('Loading esm-strings.js dynamically...');

// Dynamic import returns a Promise
import('./esm-strings.js').then(module => {
  const slug = module.toSlug('Dynamic Import Example');
  lines.push(`Dynamically imported toSlug: "${slug}"`);
  document.getElementById('esm-output').textContent = lines.join('\n');
}).catch(err => {
  lines.push(`Dynamic import failed: ${err.message}`);
  document.getElementById('esm-output').textContent = lines.join('\n');
});

// Render initial (synchronous) output
document.getElementById('esm-output').textContent = lines.join('\n');

// Comparison note
document.getElementById('comparison-output').textContent =
`CommonJS (Node.js — cjs-example.js):
  const { add, PI } = require('./math');           // synchronous
  module.exports = { myFn };                        // export
  const dynamic = require(\`./\${name}\`);            // dynamic (runtime)

ESM (modern standard):
  import { add, PI } from './esm-math.js';          // static, hoisted
  import formatNumber from './esm-math.js';         // default import
  import * as Math from './esm-math.js';             // namespace
  export function myFn() { ... }                     // named export
  export default myFn;                               // default export
  const m = await import('./esm-math.js');           // dynamic import

Key ESM advantages over CJS:
  ✓ Tree-shakeable (bundlers remove unused exports)
  ✓ Static analysis (IDEs can type-check, tooling is better)
  ✓ Live bindings (imported values update if source changes)
  ✓ Always strict mode
  ✓ Top-level await (in modules)
  ✓ Works natively in modern browsers and Node.js 12+`;
