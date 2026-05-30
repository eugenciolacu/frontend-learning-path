# Chapter 1: TypeScript Fundamentals

## 1. What is TypeScript? Why Use It?

**TypeScript** is an open-source programming language developed and maintained by **Microsoft**. It was introduced in **2012** by Anders Hejlsberg (also the creator of C#) and has become one of the most popular languages in modern web development.

TypeScript is a **statically-typed superset of JavaScript**. This means:

- Every valid JavaScript file is also a valid TypeScript file.
- TypeScript adds **optional static typing** and other features on top of JavaScript.
- TypeScript code is **compiled (transpiled) down to plain JavaScript** before it runs in a browser or Node.js.

```
TypeScript (.ts)  →  tsc (TypeScript Compiler)  →  JavaScript (.js)
```

### TypeScript vs JavaScript

| Feature | JavaScript | TypeScript |
|---|---|---|
| Type system | Dynamic (types resolved at runtime) | Static (types checked at compile time) |
| Type errors | Discovered at runtime (crashes in production) | Discovered at compile time (before running) |
| IDE support | Basic autocomplete | Rich autocomplete, refactoring, go-to-definition |
| Learning curve | Lower | Slightly higher (type system knowledge needed) |
| Compilation step | Not required | Required (`tsc`) |
| Works everywhere JS runs | Yes | Yes (compiles to JS) |

### Why Use TypeScript?

**1. Catch errors at compile time, not at runtime**

```ts
// JavaScript — this crashes at runtime
function greet(name) {
  return "Hello, " + name.toUpperCase();
}
greet(42); // Runtime Error: name.toUpperCase is not a function

// TypeScript — this fails immediately at compile time
function greet(name: string): string {
  return "Hello, " + name.toUpperCase();
}
greet(42); // ❌ Compile Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

**2. Improved IDE experience**

TypeScript provides full **IntelliSense** (autocomplete, parameter hints, inline docs, go-to-definition) in editors like VS Code. This makes you faster and reduces documentation lookups.

**3. Self-documenting code**

Type annotations act as inline documentation. Reading a TypeScript function signature tells you exactly what inputs and outputs to expect — without needing to read the implementation.

```ts
// Unclear JavaScript
function processOrder(order, options) { ... }

// Self-documenting TypeScript
function processOrder(order: Order, options: ProcessingOptions): Promise<Receipt> { ... }
```

**4. Safer refactoring**

When you rename a property or change a function signature, TypeScript immediately flags every place in the codebase that needs to be updated. In large projects, this is invaluable.

**5. Better team collaboration**

In team environments, types create a shared contract between modules and between developers. You always know what shape of data a function expects.

**6. Gradual adoption**

TypeScript is opt-in. You can rename `.js` to `.ts`, add types incrementally, and use `any` as an escape hatch while migrating. There is no "all or nothing" requirement.

### The TypeScript Compilation Process

```
Source code (.ts)
    │
    ▼
TypeScript Compiler (tsc)
    │  ├─ Parses TypeScript syntax
    │  ├─ Performs type checking
    │  └─ Strips type annotations
    ▼
JavaScript output (.js)  ←─ runs in browsers, Node.js, Deno, etc.
```

> **Key insight:** Types are completely erased at runtime. TypeScript types are a **compile-time construct only** — they add zero overhead to the running application.

### TypeScript in the Ecosystem

TypeScript is used in many major projects:
- **Angular** (built with TypeScript)
- **VS Code** (written in TypeScript)
- **React** (supports TypeScript as a first-class option)
- **Node.js** ecosystem (most popular libraries have TypeScript type definitions)

---

## 2. Installing and Configuring TypeScript (tsconfig.json)

### Prerequisites

You need **Node.js** (which includes **npm**) installed. Download from [nodejs.org](https://nodejs.org/).

```bash
node --version   # e.g. v20.11.0
npm --version    # e.g. 10.2.4
```

### Installing TypeScript

**Globally** (available as a command everywhere on your machine):

```bash
npm install -g typescript
tsc --version  # e.g. Version 5.4.5
```

**Locally** (recommended for projects, so each project controls its own TypeScript version):

```bash
mkdir my-ts-project
cd my-ts-project
npm init -y
npm install --save-dev typescript
npx tsc --version  # use npx to run the local install
```

### Compiling TypeScript

Create a file `hello.ts`:

```ts
const message: string = "Hello, TypeScript!";
console.log(message);
```

Compile it:

```bash
tsc hello.ts
```

This produces `hello.js`:

```js
var message = "Hello, TypeScript!";
console.log(message);
```

Run the output:

```bash
node hello.js
# Hello, TypeScript!
```

### `ts-node` — Run TypeScript Directly

For development, `ts-node` lets you run `.ts` files without a manual compile step:

```bash
npm install --save-dev ts-node
npx ts-node hello.ts
# Hello, TypeScript!
```

### `tsconfig.json` — The Project Configuration File

Rather than passing options to `tsc` on every run, you configure TypeScript with a `tsconfig.json` file at the root of your project.

**Generate a default config:**

```bash
npx tsc --init
```

**Anatomy of `tsconfig.json`:**

```json
{
  "compilerOptions": {
    // ─── Target & Module ────────────────────────────────────────────────────
    "target": "ES2020",           // Which JS version to compile to
                                  // Options: ES5, ES6/ES2015, ES2017, ES2020, ESNext
    "module": "CommonJS",         // Module system in the output
                                  // Options: CommonJS (Node), ESNext (browser/Vite), AMD

    // ─── Output ─────────────────────────────────────────────────────────────
    "outDir": "./dist",           // Where compiled JS files are written
    "rootDir": "./src",           // Where your TypeScript source files live

    // ─── Type Checking Strictness ────────────────────────────────────────────
    "strict": true,               // Master switch: enables ALL strict checks below
                                  // Strongly recommended for new projects
    "noImplicitAny": true,        // Error when TS infers 'any' type implicitly
    "strictNullChecks": true,     // null and undefined are NOT assignable to other types
    "strictFunctionTypes": true,  // Stricter checking for function parameter types

    // ─── Module Resolution ───────────────────────────────────────────────────
    "moduleResolution": "node",   // How to resolve imports (node = look in node_modules)
    "esModuleInterop": true,      // Allows default imports from CommonJS modules
    "resolveJsonModule": true,    // Allows importing .json files

    // ─── Source Maps & Debugging ─────────────────────────────────────────────
    "sourceMap": true,            // Generate .js.map files for debugging in DevTools
    "declaration": true,          // Generate .d.ts type declaration files

    // ─── Additional Quality Options ───────────────────────────────────────────
    "noUnusedLocals": true,       // Error on declared but unused variables
    "noUnusedParameters": true,   // Error on declared but unused function parameters
    "noImplicitReturns": true,    // Error if not all code paths in a function return a value
    "forceConsistentCasingInFileNames": true  // Prevent case-insensitive import issues
  },
  "include": ["src/**/*"],        // Files/folders TypeScript should compile
  "exclude": [                    // Files/folders to ignore
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

### Most Important `compilerOptions` Explained

| Option | Default | Recommended | Description |
|---|---|---|---|
| `target` | `ES3` | `ES2020` or `ESNext` | JS version of compiled output |
| `strict` | `false` | `true` | Enables all strict type checks |
| `strictNullChecks` | `false` | `true` (via strict) | `null`/`undefined` are separate types |
| `noImplicitAny` | `false` | `true` (via strict) | Prevents accidental `any` types |
| `outDir` | `.` | `./dist` | Where compiled files go |
| `sourceMap` | `false` | `true` | Enables debugging original TS in DevTools |
| `esModuleInterop` | `false` | `true` | Smoother CommonJS ↔ ESM interop |

### Minimal Starter Config

For a Node.js project:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

For a browser project (e.g., with a bundler like Vite):

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```

---

## 3. Basic Types

TypeScript has a set of **primitive types** and **special types** that form the foundation of the type system.

### Primitive Types

#### `string`

Represents all text values. Use single quotes, double quotes, or template literals.

```ts
let firstName: string = "Alice";
let greeting: string = `Hello, ${firstName}!`; // template literal
let empty: string = "";

// ❌ Error
let name: string = 42;  // Type 'number' is not assignable to type 'string'
```

#### `number`

TypeScript (like JavaScript) has a single `number` type for all numeric values — integers, floats, and special values like `NaN` and `Infinity`.

```ts
let age: number = 30;
let price: number = 9.99;
let negative: number = -5;
let hex: number = 0xff;        // 255
let binary: number = 0b1010;   // 10
let octal: number = 0o17;      // 15
let notANumber: number = NaN;
let infinite: number = Infinity;

// ❌ Error
let count: number = "ten";  // Type 'string' is not assignable to type 'number'
```

#### `boolean`

Represents `true` or `false` only.

```ts
let isActive: boolean = true;
let isLoggedIn: boolean = false;

// ❌ Error
let flag: boolean = 1;    // Type 'number' is not assignable to type 'boolean'
let ok: boolean = "yes";  // Type 'string' is not assignable to type 'boolean'
```

### Special Types

#### `any`

`any` is an **escape hatch** that disables type checking for a variable. A value of type `any` can be assigned to any other type, and any operation is allowed on it.

```ts
let value: any = "hello";
value = 42;           // OK — any accepts reassignment to different types
value = true;         // OK
value = { x: 1 };    // OK

// No type errors — but also no protection!
value.foo.bar.baz;    // No compile error, but may crash at runtime
value();              // No compile error, but may crash at runtime
```

> **When to use `any`:**
> - Migrating JavaScript code to TypeScript (as a temporary measure)
> - Working with truly dynamic data where the shape is unknown
> - Third-party libraries without type definitions
>
> **Avoid `any` in new code.** Overusing `any` defeats the purpose of TypeScript. Prefer `unknown` when you need flexibility with safety.

#### `unknown`

`unknown` is the **type-safe alternative to `any`**. Like `any`, it can hold any value. Unlike `any`, you **cannot use an `unknown` value without first narrowing its type** through a type check.

```ts
let input: unknown = getUserInput(); // could be anything

// ❌ Error — you must narrow the type first
console.log(input.toUpperCase()); // Object is of type 'unknown'

// ✅ Correct — narrow with typeof
if (typeof input === "string") {
  console.log(input.toUpperCase()); // OK — TypeScript knows it's a string here
}

if (typeof input === "number") {
  console.log(input.toFixed(2)); // OK
}
```

**`any` vs `unknown` comparison:**

| | `any` | `unknown` |
|---|---|---|
| Can be assigned any value | ✅ | ✅ |
| Can be used without type check | ✅ (unsafe) | ❌ (safe) |
| Can be assigned to typed variable | ✅ | ❌ (without narrowing) |
| Recommended for dynamic data | ❌ | ✅ |

#### `void`

`void` represents the **absence of a return value**. It is most commonly used as the return type of functions that don't return anything meaningful.

```ts
function logMessage(message: string): void {
  console.log(message);
  // No return statement needed
}

function clearInput(input: HTMLInputElement): void {
  input.value = "";
  // return undefined; // also valid — void allows returning undefined
}

// A void-typed variable can only hold undefined
let nothing: void = undefined; // Valid
```

> **Note:** `void` and `undefined` are related but different. `void` is used for functions that don't return a meaningful value. `undefined` is an actual value you can return.

#### `never`

`never` represents a value that **never occurs**. It is the return type of:
- Functions that **always throw** an error
- Functions that contain an **infinite loop** (they never return)
- **Exhaustive checks** in switch statements

```ts
// Function that always throws — never returns
function throwError(message: string): never {
  throw new Error(message);
}

// Function with an infinite loop — never returns
function runForever(): never {
  while (true) {
    // process events...
  }
}

// Exhaustive type guard — used to ensure all cases are handled
type Status = "active" | "inactive" | "banned";

function handleStatus(status: Status): string {
  switch (status) {
    case "active":   return "User is active";
    case "inactive": return "User is inactive";
    case "banned":   return "User is banned";
    default:
      // If you add a new status to the union but forget to handle it here,
      // TypeScript will flag this as an error
      const exhaustiveCheck: never = status;
      throw new Error(`Unhandled status: ${exhaustiveCheck}`);
  }
}
```

> **Key insight:** `never` is a **bottom type** — it is assignable to every type, but no type (except `never` itself) is assignable to `never`. This makes it useful for signaling impossible states.

### Other Commonly Used Types

These are not in the chapter topic list but are essential context:

#### `null` and `undefined`

Without `strictNullChecks`, `null` and `undefined` are assignable to any type. With `strictNullChecks: true` (recommended), they are distinct types.

```ts
let name: string = "Alice";
// name = null;       // ❌ Error with strictNullChecks
// name = undefined;  // ❌ Error with strictNullChecks

let maybeNull: string | null = null;      // ✅ Must declare it explicitly
let maybeUndefined: string | undefined;   // ✅ undefined for uninitialized
```

#### Arrays

```ts
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// Alternative generic syntax
let scores: Array<number> = [95, 87, 100];
```

#### Type Summary Table

| Type | Description | Example |
|---|---|---|
| `string` | Text values | `"hello"`, `'world'`, `` `hi ${name}` `` |
| `number` | Integers and floats | `42`, `3.14`, `NaN`, `Infinity` |
| `boolean` | True or false | `true`, `false` |
| `any` | Disables type checking | Avoid in new code |
| `unknown` | Any value, but requires type check before use | Safe alternative to `any` |
| `void` | No meaningful return value (used in functions) | `function log(): void {}` |
| `never` | Value that never occurs | Always-throwing or infinite-loop functions |
| `null` | Intentional absence of value | `let x: string \| null = null` |
| `undefined` | Variable declared but not assigned | `let x: string \| undefined` |

---

## 4. Type Inference and Type Annotations

TypeScript has two complementary mechanisms for associating types with values: **inference** (automatic) and **annotations** (explicit).

### Type Annotations

A **type annotation** is an explicit declaration of a type, written after a colon:

```ts
//  variable: type = value
let username: string = "alice";
let age: number = 25;
let isAdmin: boolean = false;
```

Annotations for function parameters and return types:

```ts
//                 param: type       return type
function add(a: number, b: number): number {
  return a + b;
}

//                          optional param
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"}, ${name}!`;
}
```

### Type Inference

TypeScript's compiler is smart enough to **infer (automatically determine) the type** of a variable based on the assigned value. You don't always need to write the type explicitly.

```ts
let message = "Hello!";   // TypeScript infers: string
let count = 0;             // TypeScript infers: number
let active = true;         // TypeScript infers: boolean
let nothing = null;        // TypeScript infers: null
```

You can verify inferred types by hovering over variables in VS Code — TypeScript will show the inferred type in a tooltip.

**Inference also works with functions:**

```ts
// TypeScript infers the return type as number
function multiply(a: number, b: number) {
  return a * b;  // inferred: number
}

// TypeScript infers the return type as string[]
function getNames() {
  return ["Alice", "Bob", "Carol"]; // inferred: string[]
}
```

### `const` Narrowing (Literal Types)

With `const`, TypeScript infers a **literal type** — the exact value — rather than the broader primitive type.

```ts
let  mutableString = "hello";  // inferred type: string  (can change)
const literalString = "hello"; // inferred type: "hello" (exact value, cannot change)

let  mutableNum = 42;   // inferred type: number
const literalNum = 42;  // inferred type: 42 (literal type)
```

This is called **literal type narrowing** and is important for discriminated unions and pattern matching.

### When to Use Annotations vs Inference

| Situation | Use Annotation | Use Inference |
|---|---|---|
| Variable initialized with a value | ❌ (redundant) | ✅ |
| Variable declared without initialization | ✅ | ❌ (would be `any`) |
| Function parameters | ✅ (always) | ❌ |
| Function return type | ✅ (recommended for public APIs) | ✅ (fine for internal functions) |
| Complex or non-obvious types | ✅ | ❌ |
| Simple, obvious assignments | ❌ (redundant) | ✅ |

**Examples:**

```ts
// ✅ Inference is fine here — type is obvious
const pi = 3.14159;
const username = "alice";
const active = true;

// ✅ Annotation needed — no initializer
let errorMessage: string;
// later...
errorMessage = "Something went wrong";

// ✅ Annotation needed — empty array (TypeScript can't infer element type)
const items: string[] = [];
items.push("apple");

// ✅ Annotation improves clarity — complex return type
function parseConfig(raw: string): AppConfig {
  return JSON.parse(raw);
}

// ❌ Redundant annotation — inference already handles this
const name: string = "Alice";  // TypeScript already infers string
const num: number = 42;        // TypeScript already infers number
```

### Type Widening

When you use `let`, TypeScript **widens** the type from a literal to its primitive:

```ts
let x = "hello";  // widened to: string (not "hello")
x = "world";      // ✅ Valid — string is reassignable

const y = "hello"; // narrowed to: "hello" (literal type)
// y = "world";    // ❌ Error — "hello" is not "world"
```

### Implicit `any` Warning

If you declare a variable without an initializer and without a type annotation, TypeScript may infer `any` (unless `noImplicitAny` is enabled, which it is under `strict: true`):

```ts
// With strict: true — this is an ERROR
let data;  // ❌ Variable 'data' implicitly has an 'any' type

// Fix: provide a type annotation
let data: string;
let data: unknown;  // if it truly could be anything
```

> **Best practice:** With `strict: true` in your `tsconfig.json`, TypeScript will prevent implicit `any` types, encouraging you to be explicit about types from the start.

---

## Further Reading

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook: The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Playground](https://www.typescriptlang.org/play) — Try TypeScript in your browser without installing anything
- [tsconfig.json Reference](https://www.typescriptlang.org/tsconfig)
- [DefinitelyTyped](https://definitelytyped.org/) — Type definitions for popular JavaScript libraries
- [MDN: TypeScript Overview](https://developer.mozilla.org/en-US/docs/Glossary/TypeScript)
