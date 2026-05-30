/**
 * annotations.ts
 *
 * Demonstrates when and how to write explicit type annotations.
 *
 * Annotations are written with a colon after the variable name or parameter:
 *   let variable: Type = value;
 *   function fn(param: Type): ReturnType { ... }
 *
 * Rule of thumb:
 *   - Let TypeScript infer when it's obvious (initialized variables)
 *   - Annotate when: no initializer, function parameters, public APIs, complex types
 *
 * Run:  npx ts-node annotations.ts
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. When annotations ARE needed
// ─────────────────────────────────────────────────────────────────────────────

console.log("=== When Annotations Are Needed ===");

// a) Variable declared without an initializer
// Without an annotation, TypeScript can't infer the type (it would be 'any').
// With strict: true, this is a compile error unless you annotate.
let errorMessage: string;             // ✅ type is string
let retryCount: number;               // ✅ type is number
let isConnected: boolean;             // ✅ type is boolean

// Assign later
errorMessage = "Connection timeout";
retryCount = 3;
isConnected = false;

console.log(errorMessage);  // Connection timeout
console.log(retryCount);    // 3
console.log(isConnected);   // false

// b) Empty array — TypeScript cannot infer element type
// const items = [];          // ❌ inferred as never[] — you can't push anything!
const items: string[] = [];  // ✅ explicitly typed as string[]
items.push("apple");
items.push("banana");
console.log(items);          // [ 'apple', 'banana' ]

// c) Function parameters — TypeScript CANNOT infer parameter types
// Parameters have no default value or assignment for TypeScript to read from.
function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale);
}

console.log(formatDate(new Date("2024-06-15"), "en-US")); // e.g. 6/15/2024

// ─────────────────────────────────────────────────────────────────────────────
// 2. Annotating function parameters and return types
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n=== Function Annotations ===");

// Basic function with annotated params and return type
function add(a: number, b: number): number {
  return a + b;
}

// Optional parameter — use '?' to mark it as optional
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}

// Parameter with a default value (type is inferred from the default)
function repeat(text: string, times: number = 1): string {
  return text.repeat(times);
}

// Function that returns nothing
function printLine(text: string): void {
  console.log(`  > ${text}`);
}

// Function that never returns
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

console.log(add(10, 5));              // 15
console.log(greet("Alice"));          // Hello, Alice!
console.log(greet("Bob", "Hi"));      // Hi, Bob!
console.log(repeat("ha", 3));         // hahaha
printLine("this is printed");

// ─────────────────────────────────────────────────────────────────────────────
// 3. When annotations are REDUNDANT (avoid over-annotating)
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n=== Redundant Annotations (Anti-Patterns) ===");

// ❌ Redundant — TypeScript already infers string
const nameRedundant: string = "Alice";
// ✅ Better
const personName = "Alice";

// ❌ Redundant — TypeScript already infers number
const ageRedundant: number = 25;
// ✅ Better
const age = 25;

// ❌ Redundant — return type is obviously string from the template literal
function buildGreetingRedundant(n: string): string {
  return `Hello, ${n}!`;
}
// ✅ Better — let inference handle the return type for simple internal functions
function buildGreeting(n: string) {
  return `Hello, ${n}!`;
}

console.log(personName, age);        // Alice 25
console.log(buildGreeting("Carol")); // Hello, Carol!

// ─────────────────────────────────────────────────────────────────────────────
// 4. Annotating complex and non-obvious types
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n=== Complex Type Annotations ===");

// Object type annotation (inline)
let config: { host: string; port: number; ssl: boolean } = {
  host: "localhost",
  port: 3000,
  ssl: false,
};

// Using a type alias for reuse (more in Chapter 2)
type Coordinates = { x: number; y: number };

let startPoint: Coordinates = { x: 0, y: 0 };
let point: Coordinates = { x: 3, y: 4 };

function distanceTo(a: Coordinates, b: Coordinates): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

console.log(config);
console.log(`Distance: ${distanceTo(startPoint, point).toFixed(2)}`); // Distance: 5.00

// Union type annotation — a variable that can be one of multiple types
let idInput: string | number;
idInput = "user-123";
console.log(`ID (string): ${idInput}`);
idInput = 456;
console.log(`ID (number): ${idInput}`);

// Annotating a function type (callback)
function applyToNumbers(numbers: number[], transform: (n: number) => number): number[] {
  return numbers.map(transform);
}

const doubled = applyToNumbers([1, 2, 3, 4], (n) => n * 2);
const squared = applyToNumbers([1, 2, 3, 4], (n) => n ** 2);

console.log(doubled); // [ 2, 4, 6, 8 ]
console.log(squared); // [ 1, 4, 9, 16 ]

// ─────────────────────────────────────────────────────────────────────────────
// 5. Type assertion — telling TypeScript "I know better"
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n=== Type Assertions ===");

// Sometimes you know more about a value's type than TypeScript does.
// Use 'as Type' to assert a more specific type.

// Common case: DOM element queries
// document.getElementById returns HTMLElement | null
// We assert it is a specific element type
// const input = document.getElementById("my-input") as HTMLInputElement;
// input.value = "hello";  // ✅ Now .value is accessible

// Working with unknown API responses
const apiResponse: unknown = { status: 200, data: "OK" };

// After validating, assert the specific type
type ApiResult = { status: number; data: string };
const result = apiResponse as ApiResult;
console.log(`Status: ${result.status}, Data: ${result.data}`);

// ⚠️ Warning: Type assertions bypass type checking!
// Only use them when you are CERTAIN about the type.
// Prefer type guards (typeof, instanceof, custom guards) when possible.

// ─────────────────────────────────────────────────────────────────────────────
// 6. Summary — annotation decision guide
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n=== Decision Guide ===");
console.log(`
Situation                                  | Annotation needed?
-------------------------------------------|-------------------
Variable with obvious initializer          | No  (use inference)
Variable with no initializer               | Yes
Empty array                                | Yes
Function parameter                         | Yes (always)
Function return type (simple/internal)     | No  (use inference)
Function return type (public API)          | Yes (be explicit)
Complex or non-obvious type               | Yes
Union type                                 | Yes
`);
