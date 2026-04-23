# Chapter 1: JS Basics

## 1. What is JavaScript? Where Does It Run?

JavaScript is a high-level, dynamic, interpreted (and JIT-compiled) programming language primarily used to add interactivity and behavior to web pages. It was created by **Brendan Eich** in 1995 while he was working at Netscape Communications, originally under the name "Mocha", then "LiveScript", before being renamed to "JavaScript". Despite the name, it has no inherent relation to Java — the name was a marketing decision.

JavaScript is standardized through **ECMAScript (ES)**, maintained by the TC39 committee at ECMA International. Major milestones:
- **ES5 (2009)**: Strict mode, JSON support
- **ES6 / ES2015**: `let`, `const`, arrow functions, classes, modules, Promises
- **ES2016+**: Yearly releases with progressive features

### Where Does JavaScript Run?

JavaScript was originally designed to run **inside web browsers**, where it has access to the Document Object Model (DOM) and Browser APIs. Today, it runs in many more environments:

| Environment | Runtime / Engine | Use Case |
|---|---|---|
| Browser | V8 (Chrome), SpiderMonkey (Firefox), JavaScriptCore (Safari) | UI interactivity, DOM manipulation |
| Server | Node.js (V8-based) | Backend APIs, CLI tools, scripting |
| Mobile | React Native, Expo | Cross-platform mobile apps |
| Desktop | Electron | Cross-platform desktop apps (VS Code!) |
| Edge/CDN | Cloudflare Workers, Deno Deploy | Serverless edge computing |
| Embedded | Espruino, MicroPython-JS variants | IoT devices |

### The Role of JavaScript in the Web Stack

The three pillars of web development are:

```
HTML  →  Structure   (What is on the page)
CSS   →  Presentation (How it looks)
JS    →  Behavior    (What it does / responds to user)
```

### How JavaScript Is Included in a Web Page

```html
<!-- Internal script -->
<script>
  console.log("Hello from inline JS!");
</script>

<!-- External script (preferred) -->
<script src="app.js" defer></script>

<!-- Modern ES Module -->
<script type="module" src="app.mjs"></script>
```

> **Best Practice:** Use the `defer` attribute on external scripts to prevent blocking HTML parsing. Place `<script>` tags at the end of `<body>` or use `defer`/`async`.

| Attribute | Behavior |
|---|---|
| _(none)_ | Blocks HTML parsing while script is fetched & executed |
| `defer` | Fetched in parallel, executed after HTML is parsed |
| `async` | Fetched in parallel, executed as soon as available |

### JavaScript Engine Basics

When a browser (or Node.js) runs JavaScript, the **engine**:
1. **Parses** the source code into an Abstract Syntax Tree (AST)
2. **Compiles** it to bytecode / machine code (JIT compilation)
3. **Executes** it on the CPU

This makes modern JavaScript very fast despite being a dynamic language.

---

## 2. Variables: `var`, `let`, `const`, and Scope

A **variable** is a named container that stores a value. JavaScript has three keywords for declaring variables, each with different behaviors around **scope**, **hoisting**, and **reassignment**.

### Declaring Variables

```js
var name = "Alice";    // old way — function-scoped
let age = 25;          // modern — block-scoped, reassignable
const PI = 3.14159;    // modern — block-scoped, not reassignable
```

### `var` — The Old Way

- **Scope**: Function-scoped (or globally scoped if declared outside a function)
- **Hoisting**: Declarations are moved to the top of their scope (initialized as `undefined`)
- **Re-declaration**: Allowed in the same scope
- **Reassignment**: Allowed

```js
console.log(x); // undefined (not an error — hoisted!)
var x = 10;
console.log(x); // 10

var x = 20; // re-declaration — allowed but confusing
console.log(x); // 20

function greet() {
  var greeting = "Hello";
  console.log(greeting); // "Hello"
}
// console.log(greeting); // ReferenceError — not accessible outside function
```

> **Why avoid `var`?** Hoisting and function scope make `var` hard to reason about in large codebases. It can cause subtle bugs when variables are used before assignment.

### `let` — Block-Scoped Variable

- **Scope**: Block-scoped (`{}` braces)
- **Hoisting**: Hoisted but NOT initialized → **Temporal Dead Zone (TDZ)**
- **Re-declaration**: Not allowed in the same scope
- **Reassignment**: Allowed

```js
let count = 0;
count = 1; // OK — reassignment allowed

if (true) {
  let blockVar = "I'm inside the block";
  console.log(blockVar); // "I'm inside the block"
}
// console.log(blockVar); // ReferenceError — out of scope

// Temporal Dead Zone (TDZ)
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;
```

### `const` — Block-Scoped Constant

- **Scope**: Block-scoped
- **Hoisting**: Hoisted but in TDZ (same as `let`)
- **Re-declaration**: Not allowed
- **Reassignment**: Not allowed — must be initialized at declaration

```js
const MAX_SIZE = 100;
// MAX_SIZE = 200; // TypeError: Assignment to constant variable

// IMPORTANT: const does NOT make objects immutable!
const user = { name: "Alice" };
user.name = "Bob"; // ✅ Allowed — mutating the object's property
// user = {};       // ❌ TypeError — reassigning the binding

const colors = ["red", "green"];
colors.push("blue"); // ✅ Allowed — mutating the array
// colors = [];     // ❌ TypeError
```

> `const` prevents **rebinding** (the variable pointing to a different value), not **mutation** (changing the value itself). Use `Object.freeze()` if you need a truly immutable object.

### Comparison Table

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized as `undefined`) | Yes (TDZ) | Yes (TDZ) |
| Re-declaration | ✅ Allowed | ❌ Not allowed | ❌ Not allowed |
| Reassignment | ✅ Allowed | ✅ Allowed | ❌ Not allowed |
| Must initialize | No | No | ✅ Yes |

### Scope in Depth

**Scope** determines where variables are accessible in your code.

#### Global Scope
Variables declared outside any function or block are in the **global scope** and accessible everywhere.

```js
let globalMessage = "I'm global";

function showMessage() {
  console.log(globalMessage); // ✅ Accessible
}
showMessage();
```

#### Function Scope
Variables declared inside a function are only accessible within that function.

```js
function calculate() {
  let result = 42; // function-scoped
  console.log(result); // ✅ Accessible
}
// console.log(result); // ❌ ReferenceError
```

#### Block Scope
`let` and `const` are scoped to the nearest pair of `{}`.

```js
{
  let blockScoped = "only inside";
  const alsoBlockScoped = "me too";
  console.log(blockScoped); // ✅
}
// console.log(blockScoped); // ❌ ReferenceError
```

#### Lexical Scope (Scope Chain)
Inner scopes have access to variables in outer scopes — but not vice versa.

```js
let outer = "outer";

function outerFn() {
  let middle = "middle";

  function innerFn() {
    let inner = "inner";
    console.log(outer);  // ✅ "outer"
    console.log(middle); // ✅ "middle"
    console.log(inner);  // ✅ "inner"
  }

  innerFn();
  // console.log(inner); // ❌ ReferenceError
}
```

### Hoisting Explained

**Hoisting** is JavaScript's behavior of moving variable and function declarations to the top of their scope before execution.

```js
// What you write:
console.log(a); // undefined
var a = 5;

// What the JS engine sees (conceptually):
var a;          // declaration hoisted
console.log(a); // undefined
a = 5;          // assignment stays in place
```

With `let` and `const`, declarations are hoisted but not initialized — accessing them before declaration throws a `ReferenceError` (Temporal Dead Zone):

```js
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

### Best Practices

- **Prefer `const`** by default — signals the variable won't be reassigned
- **Use `let`** when you need to reassign (loop counters, accumulating values)
- **Avoid `var`** — it's legacy and causes confusing behavior
- Declare variables at the **top of their scope** for readability

---

## 3. Data Types

JavaScript is a **dynamically typed** language — variables don't have fixed types; the type is determined by the value at runtime. There are **8 data types** in JavaScript: **7 primitive types** and **1 non-primitive type** (Object).

### Primitive Types

Primitives are **immutable** — when you assign or pass a primitive, you work with a **copy** of the value.

#### String

Represents textual data. Strings can be created with single quotes, double quotes, or backticks (template literals).

```js
let single = 'Hello';
let double = "World";
let template = `Hello, ${double}!`; // Template literal with interpolation

console.log(template); // "Hello, World!"

// String properties and common methods
let str = "JavaScript";
console.log(str.length);          // 10
console.log(str.toUpperCase());   // "JAVASCRIPT"
console.log(str.toLowerCase());   // "javascript"
console.log(str.includes("Script")); // true
console.log(str.slice(0, 4));     // "Java"
console.log(str.indexOf("a"));    // 1

// Template literals — multiline & expressions
let name = "Alice";
let age = 25;
let message = `My name is ${name} and I am ${age * 2} years old in 2050.`;
// "My name is Alice and I am 50 years old in 2050."

// Multiline string
let multiline = `Line 1
Line 2
Line 3`;
```

> **Note:** Strings in JavaScript are **immutable** — methods like `toUpperCase()` return a new string; they don't modify the original.

#### Number

JavaScript uses a **single 64-bit floating-point format (IEEE 754)** for all numbers — there is no separate integer type.

```js
let integer = 42;
let float = 3.14;
let negative = -7;
let scientific = 1.5e6; // 1,500,000

// Special numeric values
console.log(1 / 0);     // Infinity
console.log(-1 / 0);    // -Infinity
console.log(0 / 0);     // NaN (Not a Number)
console.log(Infinity);  // Infinity

// Checking for NaN
console.log(isNaN("hello")); // true
console.log(Number.isNaN("hello")); // false — stricter, only true for actual NaN
console.log(Number.isNaN(NaN));     // true

// Floating point pitfall
console.log(0.1 + 0.2); // 0.30000000000000004 (not 0.3!)
// Solution:
console.log((0.1 + 0.2).toFixed(2)); // "0.30" (string)
console.log(Math.round((0.1 + 0.2) * 100) / 100); // 0.3

// Useful Number methods
console.log(Number.isInteger(42));   // true
console.log(Number.isFinite(Infinity)); // false
console.log(parseInt("42px"));       // 42
console.log(parseFloat("3.14abc"));  // 3.14
console.log((1234.5678).toFixed(2)); // "1234.57"
```

#### Boolean

Represents a logical value: `true` or `false`. Used in conditions and logical operations.

```js
let isLoggedIn = true;
let hasPermission = false;

// Values that are "falsy" (treated as false in boolean context):
// false, 0, -0, 0n, "", '', ``, null, undefined, NaN

// Values that are "truthy" (everything else):
// "hello", 42, [], {}, function(){}, true

// Explicit conversion
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
console.log(Boolean("hello"));   // true
console.log(Boolean(42));        // true
console.log(Boolean([]));        // true (empty array is truthy!)
console.log(Boolean({}));        // true (empty object is truthy!)
```

#### `null`

`null` represents the **intentional absence of any value**. It is explicitly set by the programmer to indicate "no value here".

```js
let selectedUser = null; // No user selected yet

// typeof null is a well-known JS quirk:
console.log(typeof null); // "object" — this is a historical bug in JS!

// Checking for null
console.log(selectedUser === null); // true — use strict equality
```

> `null` vs `undefined`: Use `null` when you intentionally want to represent "no value". `undefined` means a variable has been declared but not assigned a value.

#### `undefined`

A variable that has been declared but not assigned a value is `undefined`. Functions that don't explicitly return a value also return `undefined`.

```js
let x;
console.log(x); // undefined

function doNothing() {} // implicitly returns undefined
console.log(doNothing()); // undefined

let obj = { name: "Alice" };
console.log(obj.age); // undefined — property doesn't exist

// typeof undefined
console.log(typeof undefined); // "undefined"
console.log(typeof x);        // "undefined" (even if x is not declared!)
```

#### `symbol`

Symbols are **guaranteed unique** identifiers, useful as object property keys to avoid name collisions — especially when working with third-party objects or building libraries.

```js
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(id1 === id2); // false — every Symbol is unique!
console.log(typeof id1);  // "symbol"
console.log(id1.toString()); // "Symbol(id)"
console.log(id1.description); // "id"

// Common use case: unique object keys
const USER_KEY = Symbol("userKey");
const obj = {};
obj[USER_KEY] = { name: "Alice" };

// Symbol keys are not enumerable in for...in or Object.keys()
console.log(Object.keys(obj)); // [] — symbol keys are hidden
console.log(obj[USER_KEY]);    // { name: "Alice" }

// Well-known symbols (used by JS internals)
// Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance, etc.
```

#### `bigint`

`BigInt` allows representation of integers with **arbitrary precision** — useful when working with numbers larger than `Number.MAX_SAFE_INTEGER` (2⁵³ - 1).

```js
const big = 9007199254740991n; // append 'n' to create a BigInt
const alsoValid = BigInt("9007199254740991");

console.log(typeof big); // "bigint"
console.log(9007199254740992n); // Works correctly
console.log(9007199254740992);  // 9007199254740992 (may lose precision)

// Arithmetic with BigInt
console.log(10n + 20n); // 30n
console.log(10n * 3n);  // 30n
console.log(7n / 2n);   // 3n (integer division — no decimals)

// Cannot mix BigInt and Number
// console.log(10n + 10); // ❌ TypeError
console.log(Number(10n) + 10); // ✅ 20 — explicit conversion
```

### Non-Primitive Type: Object

Everything that is not a primitive is an **Object** in JavaScript. Objects are **reference types** — variables hold a reference (memory address), not the value itself.

```js
// Object (key-value pairs)
const person = { name: "Alice", age: 25 };

// Array (ordered list — also an object)
const colors = ["red", "green", "blue"];

// Function (also an object!)
function greet() { return "Hello!"; }

console.log(typeof person);  // "object"
console.log(typeof colors);  // "object"
console.log(typeof greet);   // "function" (special case of object)
```

> Objects are covered in depth in **Chapter 3: Objects and Arrays**.

### The `typeof` Operator

Use `typeof` to check the type of a value at runtime:

```js
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" ⚠️ historical bug
console.log(typeof Symbol());    // "symbol"
console.log(typeof 42n);         // "bigint"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object" ⚠️ use Array.isArray() instead
console.log(typeof function(){}); // "function"
```

### Type Coercion

JavaScript automatically converts types in certain situations — this is called **implicit type coercion**. It can be surprising!

```js
// String concatenation vs addition
console.log("5" + 3);    // "53" — number 3 coerced to string
console.log("5" - 3);    // 2   — string "5" coerced to number
console.log("5" * "3");  // 15  — both coerced to numbers
console.log(true + 1);   // 2   — true coerced to 1
console.log(false + 1);  // 1   — false coerced to 0
console.log(null + 1);   // 1   — null coerced to 0
console.log(undefined + 1); // NaN — undefined coerced to NaN

// Loose equality (==) also performs coercion:
console.log(0 == false);   // true ⚠️
console.log("" == false);  // true ⚠️
console.log(null == undefined); // true ⚠️
console.log(1 == "1");     // true ⚠️

// Always prefer strict equality (===) — no coercion:
console.log(1 === "1");    // false ✅
console.log(0 === false);  // false ✅
```

**Explicit Type Conversion:**

```js
// To Number
Number("42");     // 42
Number(true);     // 1
Number(false);    // 0
Number(null);     // 0
Number(undefined);// NaN
parseInt("3.7");  // 3
parseFloat("3.7");// 3.7

// To String
String(42);       // "42"
String(true);     // "true"
(42).toString();  // "42"
(255).toString(16); // "ff" (hexadecimal)

// To Boolean
Boolean(0);       // false
Boolean("");      // false
Boolean(null);    // false
Boolean(1);       // true
Boolean("hello"); // true
!!0;              // false (double negation shorthand)
!!"hello";        // true
```

### Data Types Summary Table

| Type | Example | `typeof` | Notes |
|---|---|---|---|
| `string` | `"hello"`, `'hi'`, `` `world` `` | `"string"` | Immutable text |
| `number` | `42`, `3.14`, `NaN`, `Infinity` | `"number"` | 64-bit float |
| `boolean` | `true`, `false` | `"boolean"` | Logical values |
| `null` | `null` | `"object"` | ⚠️ Historical bug |
| `undefined` | `undefined` | `"undefined"` | Not yet assigned |
| `symbol` | `Symbol("id")` | `"symbol"` | Unique identifier |
| `bigint` | `42n` | `"bigint"` | Arbitrary precision int |
| `object` | `{}`, `[]`, `null` | `"object"` | Reference type |

---

## 4. Operators

Operators perform operations on values (**operands**). JavaScript has many operator categories.

### Arithmetic Operators

Used for mathematical calculations.

```js
let a = 10;
let b = 3;

console.log(a + b);  // 13  — addition
console.log(a - b);  // 7   — subtraction
console.log(a * b);  // 30  — multiplication
console.log(a / b);  // 3.333... — division
console.log(a % b);  // 1   — modulus (remainder)
console.log(a ** b); // 1000 — exponentiation (a to the power of b)

// Increment and Decrement
let x = 5;
console.log(x++); // 5 — post-increment: returns then increments
console.log(x);   // 6
console.log(++x); // 7 — pre-increment: increments then returns
console.log(x--); // 7 — post-decrement
console.log(x);   // 6
console.log(--x); // 5 — pre-decrement

// String concatenation with +
console.log("Hello" + " " + "World"); // "Hello World"
console.log("Value: " + 42);          // "Value: 42"
```

### Assignment Operators

Used to assign values to variables.

```js
let n = 10;

n = 5;   // 5  — basic assignment
n += 3;  // 8  — same as: n = n + 3
n -= 2;  // 6  — same as: n = n - 2
n *= 4;  // 24 — same as: n = n * 4
n /= 6;  // 4  — same as: n = n / 6
n %= 3;  // 1  — same as: n = n % 3
n **= 3; // 1  — same as: n = n ** 3

// Logical assignment operators (ES2021)
let a = null;
a ??= "default"; // assigns "default" only if a is null or undefined
console.log(a);  // "default"

let b = "";
b ||= "fallback"; // assigns "fallback" if b is falsy
console.log(b);   // "fallback"

let c = "existing";
c &&= "updated"; // assigns "updated" only if c is truthy
console.log(c);  // "updated"
```

### Comparison Operators

Used to compare two values, always returning a `boolean`.

```js
let x = 5;
let y = "5";

// Loose equality (==) — performs type coercion
console.log(x == y);  // true ⚠️ — number 5 equals string "5" after coercion

// Strict equality (===) — no type coercion
console.log(x === y); // false ✅ — different types

// Loose inequality (!=)
console.log(x != y);  // false — they're "equal" with coercion

// Strict inequality (!==)
console.log(x !== y); // true ✅

// Relational operators
console.log(5 > 3);   // true
console.log(5 < 3);   // false
console.log(5 >= 5);  // true
console.log(5 <= 4);  // false

// Comparing strings (lexicographic/alphabetical order)
console.log("apple" < "banana"); // true
console.log("b" > "a");          // true
console.log("10" < "9");         // true ⚠️ — string comparison, not numeric!
console.log(10 < 9);             // false — numeric comparison

// Comparing with null and undefined
console.log(null == undefined);  // true (special rule)
console.log(null === undefined); // false
console.log(null > 0);           // false
console.log(null == 0);          // false
console.log(null >= 0);          // true ⚠️ — JS quirk
```

> **Golden Rule:** Always use `===` (strict equality) and `!==` (strict inequality) to avoid unexpected type coercion bugs.

### Logical Operators

Used to combine or invert boolean expressions. Also used for short-circuit evaluation.

```js
// AND (&&) — true only if BOTH operands are truthy
console.log(true && true);   // true
console.log(true && false);  // false
console.log(false && true);  // false

// OR (||) — true if AT LEAST ONE operand is truthy
console.log(true || false);  // true
console.log(false || false); // false
console.log(false || true);  // true

// NOT (!) — inverts a boolean
console.log(!true);  // false
console.log(!false); // true
console.log(!0);     // true  (0 is falsy)
console.log(!"");    // true  ("" is falsy)
console.log(![]);    // false ([] is truthy)

// Short-circuit evaluation
// && stops and returns the FIRST falsy value (or the last value if all truthy)
console.log(0 && "hello");       // 0   (short-circuits at 0)
console.log("hello" && 42);      // 42  (both truthy — returns last)
console.log(false && doWork());  // false — doWork() never called!

// || stops and returns the FIRST truthy value (or the last value if all falsy)
console.log(0 || "default");     // "default"
console.log("value" || "other"); // "value"
console.log(null || undefined);  // undefined (both falsy — returns last)

// Practical use of short-circuit:
let username = "";
let displayName = username || "Anonymous"; // "Anonymous"

let user = { name: "Alice" };
let name = user && user.name; // "Alice" — safe property access

// Nullish Coalescing (??) — ES2020
// Returns right side ONLY if left side is null or undefined (not other falsy values!)
console.log(null ?? "default");     // "default"
console.log(undefined ?? "default"); // "default"
console.log(0 ?? "default");        // 0   ← differs from ||
console.log("" ?? "default");       // ""  ← differs from ||
console.log(false ?? "default");    // false ← differs from ||

let count = 0;
let display = count ?? "No count"; // 0 (correct!)
let display2 = count || "No count"; // "No count" (wrong for count=0!)
```

### Ternary Operator

The **ternary operator** (`? :`) is a concise shorthand for simple `if-else` logic. It is the only JavaScript operator that takes **three operands**.

```js
// Syntax: condition ? valueIfTrue : valueIfFalse

let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Equivalent if-else:
let status2;
if (age >= 18) {
  status2 = "adult";
} else {
  status2 = "minor";
}

// Ternary in string templates
let score = 75;
console.log(`You ${score >= 50 ? "passed" : "failed"} the exam.`);
// "You passed the exam."

// Nested ternary (use sparingly — prefer if-else for readability)
let grade = score >= 90 ? "A"
          : score >= 80 ? "B"
          : score >= 70 ? "C"
          : score >= 60 ? "D"
          : "F";
console.log(grade); // "C"

// Ternary for function calls or default values
function getUser(id) { /* ... */ }
let userId = 42;
let user = userId ? getUser(userId) : null;
```

> **Best Practice:** Use the ternary operator for **simple, single-value decisions**. For complex logic with multiple statements, use `if-else` blocks for clarity.

### Other Notable Operators

```js
// typeof — returns the type of a value as a string
console.log(typeof 42);        // "number"
console.log(typeof "hello");   // "string"
console.log(typeof undefined); // "undefined"

// instanceof — checks if an object is an instance of a class/constructor
console.log([] instanceof Array);   // true
console.log({} instanceof Object);  // true

// in — checks if a property exists in an object
const car = { brand: "Toyota", year: 2022 };
console.log("brand" in car);  // true
console.log("price" in car);  // false

// delete — removes a property from an object
delete car.year;
console.log(car); // { brand: "Toyota" }

// Optional Chaining (?.) — ES2020
// Safely access nested properties without throwing if intermediate is null/undefined
const userProfile = null;
console.log(userProfile?.address?.city); // undefined (no error!)
// Without optional chaining:
// console.log(userProfile.address.city); // ❌ TypeError: Cannot read properties of null

// Comma operator — evaluates multiple expressions, returns the last
let result = (1 + 2, 3 + 4, 5 + 6);
console.log(result); // 11 (last expression)
```

### Operator Precedence

Operators follow a specific **order of evaluation** (similar to math's PEMDAS):

```js
// Higher precedence is evaluated first
console.log(2 + 3 * 4);     // 14 — multiplication before addition
console.log((2 + 3) * 4);   // 20 — parentheses override precedence

// Precedence order (highest to lowest, simplified):
// 1. () — grouping
// 2. ++ -- (postfix), . [] () — member/call
// 3. ++ -- ! ~ typeof (prefix)
// 4. ** (right-to-left)
// 5. * / %
// 6. + -
// 7. < > <= >= instanceof in
// 8. == != === !==
// 9. &&
// 10. ||
// 11. ??
// 12. ? : (ternary)
// 13. = += -= *= /= (assignment)
// 14. , (comma)

let x = 2 + 3 > 4 && true;
// Step 1: 2 + 3 → 5
// Step 2: 5 > 4 → true
// Step 3: true && true → true
console.log(x); // true
```

---

## Further Reading

- [MDN — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN — Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)
- [MDN — Data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN — Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [javascript.info — The Modern JavaScript Tutorial](https://javascript.info/)
- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
