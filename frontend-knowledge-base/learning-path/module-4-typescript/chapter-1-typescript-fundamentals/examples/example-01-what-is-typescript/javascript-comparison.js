/**
 * javascript-comparison.js
 *
 * Plain JavaScript version of the same logic below.
 * Notice: there are NO type checks, NO IDE hints about wrong arguments,
 * and ALL mistakes are discovered only when the code runs (or not at all).
 */

// ─── 1. A function that expects a string ─────────────────────────────────────

function greetUser(name) {
  // JavaScript has no idea what type 'name' is.
  // If someone passes a number, .toUpperCase() will crash at runtime.
  return "Hello, " + name.toUpperCase() + "!";
}

console.log(greetUser("alice")); // ✅ Hello, ALICE!
// console.log(greetUser(42));   // 💥 Runtime TypeError: name.toUpperCase is not a function

// ─── 2. A function that does arithmetic ──────────────────────────────────────

function addNumbers(a, b) {
  return a + b;
}

console.log(addNumbers(2, 3));      // ✅ 5
console.log(addNumbers("2", 3));    // ⚠️  "23" — string concatenation, not addition!
                                    //   No warning. JavaScript silently does the wrong thing.

// ─── 3. An object without a defined shape ────────────────────────────────────

function printUser(user) {
  // Nothing prevents calling this with a completely wrong object
  console.log(`Name: ${user.name}, Age: ${user.age}`);
}

printUser({ name: "Alice", age: 30 }); // ✅ Name: Alice, Age: 30
printUser({ name: "Bob" });             // ⚠️  Name: Bob, Age: undefined — no error thrown
printUser("not an object");             // 💥 Runtime TypeError in production

// ─── 4. No autocomplete for return shapes ────────────────────────────────────

function getConfig() {
  return {
    host: "localhost",
    port: 3000,
    debug: true,
  };
}

const config = getConfig();
// config.hos  ← an IDE gives no hint that this is a typo (should be .host)
// In a large codebase, this kind of bug can be very hard to find.
