"use strict";
/**
 * src/index.ts
 *
 * A simple entry point to verify the tsconfig.json is working.
 *
 * Compile:  npx tsc
 * Run:      node dist/index.js
 */
// ─── 1. Verify strict null checks are active ─────────────────────────────────
function getUserName(id) {
    // Simulated lookup
    const users = {
        1: "Alice",
        2: "Bob",
    };
    return users[id] ?? null;
}
const name = getUserName(1);
// With strictNullChecks: true, we must handle the null case
if (name !== null) {
    console.log("Found user:", name.toUpperCase()); // ✅ Safe — TS knows name is string here
}
// Without the null check, TS would error:
// console.log(name.toUpperCase());
// ❌ Error: Object is possibly 'null'.
// ─── 2. noUnusedLocals check ─────────────────────────────────────────────────
// With noUnusedLocals: true, this would cause a compile error:
// const unusedVariable = "I am never used"; // ❌ 'unusedVariable' is declared but its value is never read
const version = "1.0.0"; // ✅ Used below
// ─── 3. noImplicitReturns check ──────────────────────────────────────────────
// With noImplicitReturns: true, all code paths must return a value
function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b; // ✅ All paths return (or throw)
}
// ─── 4. Source map verification ──────────────────────────────────────────────
// After compiling, check dist/ — you will find:
//   index.js       (compiled JavaScript)
//   index.js.map   (source map — maps back to index.ts for debugging)
console.log(`App version: ${version}`);
console.log(`10 / 2 = ${divide(10, 2)}`);
console.log("tsconfig.json is configured correctly ✅");
//# sourceMappingURL=index.js.map