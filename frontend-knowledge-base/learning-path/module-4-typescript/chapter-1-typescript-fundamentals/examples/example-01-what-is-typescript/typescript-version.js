"use strict";
/**
 * typescript-version.ts
 *
 * TypeScript version of the same logic as javascript-comparison.js.
 *
 * Key differences:
 *  - Type annotations tell the compiler (and your IDE) exactly what each
 *    variable and function parameter is expected to hold.
 *  - Mistakes are caught at compile time — before the code ever runs.
 *  - The compiled output (.js) is identical to what you'd write in JS —
 *    types are completely erased at runtime.
 *
 * Run:  tsc typescript-version.ts && node typescript-version.js
 *   or: ts-node typescript-version.ts
 */
// ─── 1. A function that expects a string ─────────────────────────────────────
// The ': string' annotation says: name must be a string
// The ': string' after the parens says: this function returns a string
function greetUser(name) {
    return "Hello, " + name.toUpperCase() + "!";
}
console.log(greetUser("alice")); // ✅ Hello, ALICE!
// ❌ COMPILE ERROR — try uncommenting this line:
// console.log(greetUser(42));
// Error: Argument of type 'number' is not assignable to parameter of type 'string'.
// TypeScript catches this before the code runs!
// ─── 2. A function that does arithmetic ──────────────────────────────────────
function addNumbers(a, b) {
    return a + b;
}
console.log(addNumbers(2, 3)); // ✅ 5
function printUser(user) {
    console.log(`Name: ${user.name}, Age: ${user.age}`);
}
printUser({ name: "Alice", age: 30 }); // ✅ Name: Alice, Age: 30
function getConfig() {
    return {
        host: "localhost",
        port: 3000,
        debug: true,
    };
}
const config = getConfig();
console.log(config.host); // ✅ "localhost" — IDE autocompletes config.host, config.port, config.debug
// ❌ COMPILE ERROR — try uncommenting this:
// console.log(config.hos);
// Error: Property 'hos' does not exist on type 'AppConfig'. Did you mean 'host'?
// ─── 5. TypeScript compiles to plain JavaScript ───────────────────────────────
// After running: tsc typescript-version.ts
// Open typescript-version.js to see the output.
// All type annotations are stripped — the output is clean JavaScript.
console.log("\n✅ TypeScript caught all type errors before this code ran!");
console.log("TypeScript version:", "5.x (see tsconfig.json target)");
