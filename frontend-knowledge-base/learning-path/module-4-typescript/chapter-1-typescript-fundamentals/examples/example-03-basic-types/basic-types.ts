/**
 * basic-types.ts
 *
 * Demonstrates the three core primitive types in TypeScript:
 *   string, number, boolean
 *
 * Run:  npx ts-node basic-types.ts
 *   or: tsc basic-types.ts --target ES2020 && node basic-types.js
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. string
// ─────────────────────────────────────────────────────────────────────────────

// Explicit annotation
let firstName: string = "Alice";
let lastName: string = 'Wonderland';  // single or double quotes both work

// Template literals are also strings
let fullName: string = `${firstName} ${lastName}`;
let multiLine: string = `Line 1
Line 2
Line 3`;

// Empty string is valid
let emptyString: string = "";

console.log("=== string ===");
console.log(firstName);                       // Alice
console.log(lastName);                        // Wonderland
console.log(fullName);                        // Alice Wonderland
console.log(`Length: ${fullName.length}`);    // Length: 15
console.log(fullName.toUpperCase());          // ALICE WONDERLAND
console.log(firstName.startsWith("Al"));      // true

// ❌ These would cause COMPILE errors:
// let badString: string = 42;       // Type 'number' is not assignable to type 'string'
// let badString2: string = true;    // Type 'boolean' is not assignable to type 'string'

// ─────────────────────────────────────────────────────────────────────────────
// 2. number
// ─────────────────────────────────────────────────────────────────────────────

// TypeScript uses a single 'number' type for ALL numeric values
let age: number = 30;
let price: number = 9.99;
let temperature: number = -3.5;

// Different number literals (all valid 'number' values)
let hexColor: number = 0xff_cc_00;  // 16763904  (hex — underscores are allowed for readability)
let binaryValue: number = 0b1010;   // 10        (binary)
let octalValue: number = 0o17;      // 15        (octal)

// Special numeric values
let notANumber: number = NaN;       // result of invalid operations like 0/0
let positiveInfinity: number = Infinity;
let negativeInfinity: number = -Infinity;

// Very large numbers
let bigCount: number = 1_000_000;   // underscores as digit separators — purely visual

console.log("\n=== number ===");
console.log(age);                         // 30
console.log(price);                       // 9.99
console.log(hexColor);                    // 16763904
console.log(binaryValue);                // 10
console.log(octalValue);                  // 15
console.log(notANumber);                  // NaN
console.log(Number.isNaN(notANumber));    // true
console.log(positiveInfinity);            // Infinity
console.log(bigCount.toLocaleString());   // 1,000,000

// Arithmetic
const sum: number = age + price;
const product: number = 2 * 3.14;
console.log(`Sum: ${sum}`);       // Sum: 39.99
console.log(`Product: ${product}`); // Product: 6.28

// ❌ These would cause COMPILE errors:
// let badNum: number = "10";     // Type 'string' is not assignable to type 'number'
// let badNum2: number = true;    // Type 'boolean' is not assignable to type 'number'

// ─────────────────────────────────────────────────────────────────────────────
// 3. boolean
// ─────────────────────────────────────────────────────────────────────────────

let isLoggedIn: boolean = true;
let hasPermission: boolean = false;

// boolean results from comparisons
let isAdult: boolean = age >= 18;          // true
let isExpensive: boolean = price > 100;   // false
let isEmpty: boolean = emptyString === ""; // true

console.log("\n=== boolean ===");
console.log(isLoggedIn);      // true
console.log(hasPermission);   // false
console.log(isAdult);         // true
console.log(isExpensive);     // false
console.log(isEmpty);         // true

// Logical operators
console.log(isLoggedIn && hasPermission);   // false  (AND)
console.log(isLoggedIn || hasPermission);   // true   (OR)
console.log(!isLoggedIn);                   // false  (NOT)

// ❌ These would cause COMPILE errors:
// let badBool: boolean = 1;       // Type 'number' is not assignable to type 'boolean'
// let badBool2: boolean = "true"; // Type 'string' is not assignable to type 'boolean'
// Note: Unlike JavaScript, TypeScript does NOT treat 1 and 0 as true/false

// ─────────────────────────────────────────────────────────────────────────────
// 4. null and undefined (bonus — essential context)
// ─────────────────────────────────────────────────────────────────────────────

// With strictNullChecks: true (recommended), null and undefined are their own types

// undefined — variable declared but not yet assigned a value
let notYetAssigned: string | undefined;          // can be string OR undefined
console.log("\n=== null & undefined ===");
console.log(notYetAssigned);  // undefined

notYetAssigned = "now it has a value";
console.log(notYetAssigned);  // now it has a value

// null — intentional absence of a value
let selectedUser: string | null = null;
selectedUser = "Alice";
console.log(selectedUser);    // Alice
selectedUser = null;          // reset
console.log(selectedUser);    // null

// ❌ Without the union, these would fail:
// let strictString: string = null;     // ❌ Error with strictNullChecks
// let strictString: string = undefined; // ❌ Error with strictNullChecks

// ─────────────────────────────────────────────────────────────────────────────
// 5. Arrays (bonus — commonly needed with primitives)
// ─────────────────────────────────────────────────────────────────────────────

let fruits: string[] = ["apple", "banana", "cherry"];
let scores: number[] = [95, 87, 100, 76];
let flags: boolean[] = [true, false, true];

// Generic array syntax (equivalent):
let cities: Array<string> = ["London", "Paris", "Berlin"];

console.log("\n=== arrays ===");
console.log(fruits);          // ["apple", "banana", "cherry"]
console.log(scores[0]);       // 95
console.log(cities.length);   // 3

// TypeScript enforces array element types:
// fruits.push(42);  // ❌ Argument of type 'number' is not assignable to parameter of type 'string'
