/**
 * special-types.ts
 *
 * Demonstrates TypeScript's special types:
 *   any, unknown, void, never
 *
 * These types describe special conditions rather than data values.
 *
 * Run:  npx ts-node special-types.ts
 *   or: tsc special-types.ts --target ES2020 && node special-types.js
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. any — the escape hatch (use sparingly)
// ─────────────────────────────────────────────────────────────────────────────

// 'any' completely disables type checking for a variable.
// Any value can be assigned to it, and it can be used in any way.

let dynamicValue: any = "hello";
console.log("=== any ===");
console.log(dynamicValue);         // hello

dynamicValue = 42;                 // ✅ reassign to number
console.log(dynamicValue);         // 42

dynamicValue = true;               // ✅ reassign to boolean
console.log(dynamicValue);         // true

dynamicValue = { x: 1, y: 2 };    // ✅ reassign to object
console.log(dynamicValue);         // { x: 1, y: 2 }

// You can call any property or method — no errors from TypeScript
// (but these WILL crash at runtime if the operations are invalid!)
// dynamicValue.unknownMethod();   // No compile error, potential runtime crash

// When is 'any' acceptable?
// 1. During JavaScript → TypeScript migration (temporary)
// 2. Working with third-party libraries without types
// 3. Handling truly unstructured external data (prefer 'unknown' instead)

// ─────────────────────────────────────────────────────────────────────────────
// 2. unknown — the safe alternative to any
// ─────────────────────────────────────────────────────────────────────────────

// Like 'any', 'unknown' can hold any value.
// Unlike 'any', you MUST narrow the type before using the value.
// This forces you to handle all possible types explicitly.

console.log("\n=== unknown ===");

// Simulated function that receives data from an external source
function processInput(input: unknown): string {
  // ❌ These would cause COMPILE errors because input is unknown:
  // return input.toUpperCase();       // Error: Object is of type 'unknown'
  // return input + " processed";      // Error: Operator '+' cannot be applied to type 'unknown'

  // ✅ Narrow first — check the type, then use it
  if (typeof input === "string") {
    // TypeScript now knows input is a string in this block
    return input.toUpperCase();
  }

  if (typeof input === "number") {
    // TypeScript now knows input is a number in this block
    return input.toFixed(2);
  }

  if (Array.isArray(input)) {
    return `Array with ${input.length} items`;
  }

  if (typeof input === "object" && input !== null) {
    return `Object: ${JSON.stringify(input)}`;
  }

  return String(input); // fallback
}

console.log(processInput("hello world"));    // HELLO WORLD
console.log(processInput(3.14159));          // 3.14
console.log(processInput([1, 2, 3]));        // Array with 3 items
console.log(processInput({ a: 1 }));         // Object: {"a":1}
console.log(processInput(true));             // true

// Key difference: any vs unknown
let anyVal: any = "hello";
let unknownVal: unknown = "hello";

let str1: string = anyVal;      // ✅ any can be assigned to string (unsafe)
// let str2: string = unknownVal; // ❌ Error: unknown cannot be assigned without narrowing

// ─────────────────────────────────────────────────────────────────────────────
// 3. void — no meaningful return value
// ─────────────────────────────────────────────────────────────────────────────

// 'void' is used as the return type of functions that don't return a value.
// You don't assign void to variables (only undefined is valid for a void type).

console.log("\n=== void ===");

// Classic use case: event handlers, logging functions, side-effect functions
function logMessage(level: "INFO" | "WARN" | "ERROR", message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
  // No return statement — void says "I don't return anything useful"
}

logMessage("INFO", "Application started");
logMessage("WARN", "Memory usage is high");
logMessage("ERROR", "Database connection failed");

// You CAN return undefined explicitly from a void function
function clearCache(): void {
  // ... clear some cache ...
  return; // valid — returns undefined, which is what void allows
}

// void in callbacks
const numbers: number[] = [1, 2, 3, 4, 5];
numbers.forEach((n: number): void => {
  console.log(`  Item: ${n}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. never — values that can never exist
// ─────────────────────────────────────────────────────────────────────────────

// 'never' is the type for values that NEVER occur.
// It is used for:
//   a) Functions that always throw an error
//   b) Functions with infinite loops
//   c) Exhaustive checks to ensure all cases are handled

console.log("\n=== never ===");

// a) Function that always throws — it never returns a value
function fail(errorMessage: string): never {
  throw new Error(errorMessage);
  // Code after this line is unreachable — TypeScript knows this
}

// Usage: throw detailed errors while keeping the call-site readable
function getUser(id: number): string {
  const users: Record<number, string> = { 1: "Alice", 2: "Bob" };
  return users[id] ?? fail(`User with id ${id} not found`);
  //                   ^^^^ TypeScript allows this because fail() returns never
  //                         which is compatible with any type
}

// ❌ Uncomment to see the error in action:
// console.log(getUser(99));  // throws: User with id 99 not found

console.log(getUser(1));  // Alice

// b) Function with an infinite loop — never returns
function keepAlive(): never {
  // This would run forever in a real program (e.g., an event loop)
  // We won't actually call this, but TypeScript accepts the return type
  while (true) {
    // In a real server: process incoming requests here
    break; // NOTE: In real code, this would not have a break
  }
  // TypeScript knows the while(true) without a break means this never returns.
  // We add the break only to allow this file to be run as a demo.
  throw new Error("This line is only reached with the break above — demo only");
}

// c) Exhaustive check — ensures all union cases are handled
type TrafficLight = "red" | "yellow" | "green";

function getAction(light: TrafficLight): string {
  switch (light) {
    case "red":    return "Stop";
    case "yellow": return "Caution";
    case "green":  return "Go";
    default:
      // If a new value is added to TrafficLight but not handled above,
      // TypeScript will flag this line as an error.
      // This pattern is called an "exhaustive check".
      const _exhaustiveCheck: never = light;
      throw new Error(`Unhandled traffic light: ${_exhaustiveCheck}`);
  }
}

console.log(getAction("red"));    // Stop
console.log(getAction("yellow")); // Caution
console.log(getAction("green"));  // Go

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n=== Summary ===");
console.log(`
Type     | Description
---------|--------------------------------------------------
any      | Disables type checking — avoid in new code
unknown  | Accepts any value, but must narrow before use
void     | No meaningful return value (functions)
never    | Value that never occurs (throw / infinite loop)
`);
