/**
 * inference.ts
 *
 * Demonstrates TypeScript's type inference — the compiler's ability to
 * automatically determine types from the code you write.
 *
 * You don't always have to write type annotations. TypeScript infers them.
 * Understanding inference helps you write clean, non-redundant TypeScript.
 *
 * Run:  npx ts-node inference.ts
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Basic variable inference
// ─────────────────────────────────────────────────────────────────────────────

// TypeScript looks at the right-hand side value and infers the type.
// Hover over variables in VS Code to see the inferred type tooltip.

let message = "Hello, TypeScript!"; // inferred: string
let count = 0;                       // inferred: number
let active = true;                   // inferred: boolean
let nothing = null;                  // inferred: null
let undef = undefined;               // inferred: undefined

console.log("=== Variable Inference ===");
console.log(typeof message); // string
console.log(typeof count);   // number
console.log(typeof active);  // boolean

// Once inferred, the type is enforced:
// message = 42;     // ❌ Error: Type 'number' is not assignable to type 'string'
// count = "ten";    // ❌ Error: Type 'string' is not assignable to type 'number'

// ─────────────────────────────────────────────────────────────────────────────
// 2. const vs let — literal types vs widened types
// ─────────────────────────────────────────────────────────────────────────────

// With 'let', TypeScript widens the type to the base primitive type
// because you might reassign to a different value of the same type.
let mutableColor = "red";     // inferred: string  (not "red")
mutableColor = "blue";        // ✅ valid — any string is accepted

// With 'const', TypeScript narrows to the exact literal type
// because the value can never change.
const FIXED_COLOR = "red";    // inferred: "red"  (literal type)
// FIXED_COLOR = "blue";      // ❌ Error: Cannot assign to 'FIXED_COLOR' because it is a constant

const MAX_RETRIES = 3;        // inferred: 3  (not number)
const IS_PRODUCTION = false;  // inferred: false  (not boolean)

console.log("\n=== const Literal Types ===");
console.log(FIXED_COLOR);     // "red"
console.log(MAX_RETRIES);     // 3
console.log(IS_PRODUCTION);   // false

// This has practical implications for union types and pattern matching (more in Ch. 3)

// ─────────────────────────────────────────────────────────────────────────────
// 3. Function return type inference
// ─────────────────────────────────────────────────────────────────────────────

// TypeScript infers the return type from the function body
function double(n: number) {
  return n * 2;          // TypeScript infers return type: number
}

function getFullName(first: string, last: string) {
  return `${first} ${last}`;   // TypeScript infers return type: string
}

function getNames() {
  return ["Alice", "Bob", "Carol"]; // TypeScript infers return type: string[]
}

function getPoint() {
  return { x: 10, y: 20 };   // TypeScript infers return type: { x: number; y: number }
}

function isEven(n: number) {
  return n % 2 === 0;         // TypeScript infers return type: boolean
}

console.log("\n=== Return Type Inference ===");
console.log(double(5));              // 10
console.log(getFullName("Jane", "Doe")); // Jane Doe
console.log(getNames());             // [ 'Alice', 'Bob', 'Carol' ]
console.log(getPoint());             // { x: 10, y: 20 }
console.log(isEven(4));              // true

// ─────────────────────────────────────────────────────────────────────────────
// 4. Object inference
// ─────────────────────────────────────────────────────────────────────────────

// TypeScript infers the shape of objects
const user = {
  name: "Alice",    // inferred: string
  age: 30,          // inferred: number
  isAdmin: false,   // inferred: boolean
};

// The inferred type of 'user' is: { name: string; age: number; isAdmin: boolean }
console.log("\n=== Object Inference ===");
console.log(user.name);     // Alice
console.log(user.age);      // 30
console.log(user.isAdmin);  // false

// TypeScript enforces property types:
// user.name = 42;    // ❌ Error: Type 'number' is not assignable to type 'string'
// user.unknown = 1;  // ❌ Error: Property 'unknown' does not exist

// ─────────────────────────────────────────────────────────────────────────────
// 5. Array inference
// ─────────────────────────────────────────────────────────────────────────────

const fruits = ["apple", "banana", "cherry"]; // inferred: string[]
const mixed = [1, "two", true];               // inferred: (string | number | boolean)[]
const empty = [];                             // inferred: never[] (no info yet — be careful!)

console.log("\n=== Array Inference ===");
console.log(fruits);   // [ 'apple', 'banana', 'cherry' ]
console.log(mixed);    // [ 1, 'two', true ]

// fruits.push(42); // ❌ Error: Argument of type 'number' is not assignable to type 'string'
fruits.push("date");   // ✅ valid

// ─────────────────────────────────────────────────────────────────────────────
// 6. Inference through conditional logic (type narrowing)
// ─────────────────────────────────────────────────────────────────────────────

// TypeScript tracks type changes within conditional blocks
function describe(value: string | number): string {
  // Here, 'value' is: string | number

  if (typeof value === "string") {
    // Here, TypeScript KNOWS 'value' is a string
    return `String of length ${value.length}`;
    //                               ^^^^^^ .length is valid on string
  }

  // Here, TypeScript KNOWS 'value' is a number (the string case was handled above)
  return `Number: ${value.toFixed(2)}`;
  //                        ^^^^^^^^^ .toFixed() is valid on number
}

console.log("\n=== Narrowing Inference ===");
console.log(describe("hello")); // String of length 5
console.log(describe(3.14159)); // Number: 3.14
