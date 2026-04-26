# Chapter 3: Objects and Arrays

## Overview

JavaScript has two fundamental compound data structures: **objects** and **arrays**. An object groups named values together (key–value pairs), making it ideal for modelling real-world entities such as a user or a product. An array is an ordered list of values, perfect for collections such as a list of items or search results.

This chapter also covers three modern ES6+ features that work hand-in-hand with both structures: **destructuring**, **spread**, and **rest**. Mastering these will make your code shorter, cleaner, and more expressive.

---

## Learning Objectives

By the end of this chapter you will be able to:

- Create and manipulate objects using literal syntax
- Access and modify object properties with dot and bracket notation
- Write object methods and explain how `this` works inside them
- Use key utility methods: `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.assign()`, `Object.freeze()`
- Create and manipulate arrays
- Use mutating array methods: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`
- Use non-mutating array methods: `slice`, `concat`, `join`, `indexOf`, `includes`
- Use iteration methods: `forEach`, `map`, `filter`, `reduce`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`
- Apply array and object destructuring, including nested and with defaults
- Use the spread operator to clone and merge objects/arrays
- Use rest syntax in destructuring and function parameters

---

## 1. Creating and Using Objects

### 1.1 Object Literals

The simplest way to create an object is the **object literal** syntax — a pair of curly braces containing comma-separated **key: value** pairs.

```js
// An empty object
const empty = {};

// A user object
const user = {
  name: "Alice",
  age: 30,
  isAdmin: false,
};

console.log(user); // { name: 'Alice', age: 30, isAdmin: false }
```

Keys (also called **properties**) are strings (or Symbols). Values can be any type: strings, numbers, booleans, arrays, other objects, or functions.

```js
const product = {
  id: 1,
  title: "Laptop",
  price: 999.99,
  tags: ["electronics", "computers"],   // array value
  dimensions: { width: 35, height: 25 }, // nested object
};
```

### 1.2 Property Access: Dot vs Bracket Notation

```js
const car = { make: "Toyota", model: "Corolla", year: 2022 };

// Dot notation — preferred when the property name is known and a valid identifier
console.log(car.make);   // "Toyota"
console.log(car.year);   // 2022

// Bracket notation — required when:
//   (a) the key is stored in a variable
//   (b) the key contains spaces or special characters
//   (c) the key starts with a number
console.log(car["model"]);          // "Corolla"

const prop = "year";
console.log(car[prop]);             // 2022  — dynamic key lookup

const weirdObj = { "first name": "Bob", "2fast": true };
console.log(weirdObj["first name"]); // "Bob"
console.log(weirdObj["2fast"]);      // true
```

> **Rule of thumb:** Use dot notation by default. Switch to bracket notation when the key is dynamic or not a valid identifier.

### 1.3 Adding, Updating, and Deleting Properties

Objects are **mutable** by default. You can add, change, or remove properties at any time.

```js
const person = { name: "Carlos", age: 25 };

// Add a new property
person.email = "carlos@example.com";
console.log(person.email); // "carlos@example.com"

// Update an existing property
person.age = 26;
console.log(person.age);   // 26

// Delete a property
delete person.email;
console.log(person.email); // undefined
console.log("email" in person); // false
```

### 1.4 Checking Property Existence

```js
const config = { theme: "dark", language: "en" };

// The 'in' operator — checks own AND inherited properties
console.log("theme" in config);    // true
console.log("version" in config);  // false

// hasOwnProperty — checks only own properties (safer)
console.log(config.hasOwnProperty("theme"));   // true
console.log(config.hasOwnProperty("toString")); // false (inherited)

// Optional chaining (?.) — safe access without TypeError on missing keys
const user = { address: { city: "London" } };
console.log(user.address?.city);       // "London"
console.log(user.address?.postcode);   // undefined (no error)
console.log(user.phone?.number);       // undefined (no error)
```

### 1.5 Computed Property Names (ES6)

You can use an expression as a property name by wrapping it in square brackets inside the object literal.

```js
const field = "score";
const data = {
  [field]: 100,           // property name comes from the variable
  [`max_${field}`]: 200,  // template literal as key
};

console.log(data.score);      // 100
console.log(data.max_score);  // 200

// Practical use: building objects dynamically
function createSetting(key, value) {
  return { [key]: value };
}
console.log(createSetting("timeout", 3000)); // { timeout: 3000 }
```

### 1.6 Property Shorthand (ES6)

When the variable name matches the property name, you can write it once.

```js
const firstName = "Diana";
const lastName  = "Prince";
const age       = 28;

// Without shorthand
const userOld = { firstName: firstName, lastName: lastName, age: age };

// With shorthand — much cleaner
const userNew = { firstName, lastName, age };

console.log(userNew); // { firstName: 'Diana', lastName: 'Prince', age: 28 }
```

---

## 2. Object Methods and the `this` Keyword

### 2.1 Methods: Functions as Object Properties

A **method** is simply a function stored as a property of an object.

```js
const calculator = {
  value: 0,

  // Method using regular function expression
  add: function (n) {
    this.value += n;
    return this; // enables chaining
  },

  // Shorthand method syntax (ES6) — preferred
  subtract(n) {
    this.value -= n;
    return this;
  },

  result() {
    return this.value;
  },
};

calculator.add(10).add(5).subtract(3);
console.log(calculator.result()); // 12
```

### 2.2 The `this` Keyword

Inside a **regular function** (including regular method), `this` refers to the object that **called** the function — also known as the **execution context**.

```js
const person = {
  name: "Evan",
  greet() {
    // 'this' refers to the person object when called as person.greet()
    console.log(`Hello, I am ${this.name}`);
  },
};

person.greet(); // "Hello, I am Evan"

// Problem: losing context when a method is extracted
const greetFn = person.greet;
greetFn(); // "Hello, I am undefined" — 'this' is no longer 'person'
```

**`this` binding rules (simplified):**

| How the function is called | What `this` is |
|---|---|
| `obj.method()` | `obj` |
| `function()` / `fn()` | `undefined` (strict mode) or `window` |
| `new Constructor()` | The new object being created |
| `.call(ctx)` / `.apply(ctx)` / `.bind(ctx)` | `ctx` |
| Arrow function | Inherited from enclosing scope (lexical) |

### 2.3 Arrow Functions and `this`

Arrow functions do **not** have their own `this`. They **inherit** `this` from the surrounding (lexical) scope. This is very useful for callbacks inside methods.

```js
const timer = {
  seconds: 0,

  // ❌ Regular function — 'this' is undefined/window inside the callback
  startBroken() {
    setInterval(function () {
      this.seconds++; // 'this' is NOT the timer object here
      console.log(this.seconds); // NaN or error
    }, 1000);
  },

  // ✅ Arrow function — 'this' is inherited from startFixed's scope (the timer)
  startFixed() {
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds); // 1, 2, 3, ...
    }, 1000);
  },
};
```

> **Rule:** Use regular functions for object methods (so `this` refers to the object). Use arrow functions for callbacks and nested functions inside methods.

### 2.4 Built-in Object Utility Methods

JavaScript provides several static methods on the `Object` constructor for working with objects.

#### `Object.keys()`, `Object.values()`, `Object.entries()`

```js
const scores = { Alice: 95, Bob: 82, Carol: 88 };

// Returns an array of the object's own enumerable property keys
console.log(Object.keys(scores));    // ['Alice', 'Bob', 'Carol']

// Returns an array of the object's own enumerable property values
console.log(Object.values(scores));  // [95, 82, 88]

// Returns an array of [key, value] pairs
console.log(Object.entries(scores)); // [['Alice', 95], ['Bob', 82], ['Carol', 88]]

// Practical: iterate over an object's entries
for (const [name, score] of Object.entries(scores)) {
  console.log(`${name}: ${score}`);
}
// Alice: 95
// Bob: 82
// Carol: 88
```

#### `Object.assign()`

Copies properties from one or more **source** objects into a **target** object. Returns the modified target.

```js
const defaults = { theme: "light", language: "en", notifications: true };
const userPrefs = { theme: "dark", notifications: false };

// Merge — userPrefs overrides defaults
const settings = Object.assign({}, defaults, userPrefs);
console.log(settings);
// { theme: 'dark', language: 'en', notifications: false }

// Note: Object.assign does a SHALLOW copy
// Nested objects are still shared references
```

> **Modern alternative:** The spread operator (`{ ...a, ...b }`) is now preferred over `Object.assign` for merging (covered in Section 5).

#### `Object.freeze()`

Prevents any modification to an object (adding, updating, or deleting properties). The object becomes **immutable**.

```js
const config = Object.freeze({ apiUrl: "https://api.example.com", timeout: 5000 });

config.timeout = 9000;   // silently ignored (or throws in strict mode)
config.newProp = "test"; // silently ignored
delete config.apiUrl;    // silently ignored

console.log(config); // { apiUrl: 'https://api.example.com', timeout: 5000 }
```

> `Object.freeze()` is **shallow** — nested objects are not frozen.

#### `Object.fromEntries()`

The reverse of `Object.entries()` — converts an array of `[key, value]` pairs back into an object.

```js
const entries = [["a", 1], ["b", 2], ["c", 3]];
const obj = Object.fromEntries(entries);
console.log(obj); // { a: 1, b: 2, c: 3 }

// Practical: transform object values using map
const prices = { apple: 1.2, banana: 0.5, cherry: 3.0 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, val]) => [key, val * 0.9])
);
console.log(discounted); // { apple: 1.08, banana: 0.45, cherry: 2.7 }
```

---

## 3. Arrays

### 3.1 Creating Arrays

```js
// Array literal — preferred
const fruits = ["apple", "banana", "cherry"];

// Array constructor (rarely used)
const nums = new Array(3);        // creates [ <3 empty items> ]
const filled = new Array(3).fill(0); // [0, 0, 0]

// Array.from — creates an array from any iterable or array-like object
const chars = Array.from("hello");       // ['h', 'e', 'l', 'l', 'o']
const range = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]

// Array.of — creates an array from arguments
const three = Array.of(1, 2, 3); // [1, 2, 3]
```

### 3.2 Accessing and Modifying Elements

Arrays are zero-indexed. The first element is at index `0`.

```js
const colors = ["red", "green", "blue"];

// Access by index
console.log(colors[0]);  // "red"
console.log(colors[2]);  // "blue"
console.log(colors[colors.length - 1]); // "blue" (last element)

// Modern: Array.prototype.at() — supports negative indices
console.log(colors.at(0));   // "red"
console.log(colors.at(-1));  // "blue" (last)
console.log(colors.at(-2));  // "green" (second to last)

// Modify by index
colors[1] = "yellow";
console.log(colors); // ['red', 'yellow', 'blue']

// Length property
console.log(colors.length); // 3
```

### 3.3 Mutating Methods

These methods **change the original array**.

#### `push` and `pop` — add/remove at the **end**

```js
const stack = [1, 2, 3];

stack.push(4);       // add to end
stack.push(5, 6);    // add multiple at once
console.log(stack);  // [1, 2, 3, 4, 5, 6]

const last = stack.pop(); // remove from end
console.log(last);   // 6
console.log(stack);  // [1, 2, 3, 4, 5]
```

#### `shift` and `unshift` — add/remove at the **beginning**

```js
const queue = [2, 3, 4];

queue.unshift(1);      // add to beginning
console.log(queue);    // [1, 2, 3, 4]

const first = queue.shift(); // remove from beginning
console.log(first);    // 1
console.log(queue);    // [2, 3, 4]
```

> **Performance note:** `push`/`pop` are O(1). `shift`/`unshift` are O(n) because every element must be re-indexed.

#### `splice` — add, remove, or replace elements anywhere

```js
const letters = ["a", "b", "c", "d", "e"];

// splice(startIndex, deleteCount, ...itemsToInsert)

// Remove 2 elements starting at index 1
const removed = letters.splice(1, 2);
console.log(removed); // ['b', 'c']
console.log(letters); // ['a', 'd', 'e']

// Insert without removing (deleteCount = 0)
letters.splice(1, 0, "x", "y");
console.log(letters); // ['a', 'x', 'y', 'd', 'e']

// Replace 1 element
letters.splice(2, 1, "Z");
console.log(letters); // ['a', 'x', 'Z', 'd', 'e']
```

#### `sort`

```js
const animals = ["banana", "apple", "cherry", "date"];

// Default: sorts alphabetically (converts to strings)
animals.sort();
console.log(animals); // ['apple', 'banana', 'cherry', 'date']

// Numeric sort — MUST provide a comparator function
const nums = [10, 1, 21, 2, 100];
nums.sort((a, b) => a - b); // ascending
console.log(nums); // [1, 2, 10, 21, 100]

nums.sort((a, b) => b - a); // descending
console.log(nums); // [100, 21, 10, 2, 1]
```

> **Warning:** `[10, 1, 21].sort()` gives `[1, 10, 21]` — correct by luck. `[10, 1, 100].sort()` gives `[1, 10, 100]` — wrong! Always pass a comparator for numbers.

#### `reverse`

```js
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]  (original is mutated)
```

#### `fill`

```js
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

const partial = [1, 2, 3, 4, 5];
partial.fill(9, 1, 3); // fill with 9 from index 1 up to (not including) 3
console.log(partial);   // [1, 9, 9, 4, 5]
```

### 3.4 Non-Mutating Methods

These methods **return a new array** (or other value) and leave the original unchanged.

#### `slice` — copy a portion of an array

```js
const nums = [10, 20, 30, 40, 50];

// slice(start, end) — end is NOT included
console.log(nums.slice(1, 3));  // [20, 30]
console.log(nums.slice(2));     // [30, 40, 50] — from index 2 to end
console.log(nums.slice(-2));    // [40, 50] — last two elements
console.log(nums.slice());      // [10, 20, 30, 40, 50] — shallow copy

console.log(nums); // [10, 20, 30, 40, 50] — original unchanged
```

#### `concat` — merge arrays

```js
const a = [1, 2, 3];
const b = [4, 5, 6];
const c = a.concat(b);
console.log(c); // [1, 2, 3, 4, 5, 6]
console.log(a); // [1, 2, 3] — unchanged

// concat multiple arrays at once
const all = a.concat(b, [7, 8], 9);
console.log(all); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### `join` — convert array to string

```js
const words = ["Hello", "world", "from", "JavaScript"];
console.log(words.join(" "));    // "Hello world from JavaScript"
console.log(words.join(", "));   // "Hello, world, from, JavaScript"
console.log(words.join(""));     // "HelloworldfromJavaScript"
console.log(words.join("-"));    // "Hello-world-from-JavaScript"
```

#### `indexOf` and `lastIndexOf`

```js
const arr = [10, 20, 30, 20, 10];

console.log(arr.indexOf(20));      // 1 — first occurrence
console.log(arr.lastIndexOf(20));  // 3 — last occurrence
console.log(arr.indexOf(99));      // -1 — not found
```

#### `includes`

```js
const fruits = ["apple", "banana", "cherry"];

console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape"));  // false

// Tip: use includes for simple existence checks instead of indexOf
if (fruits.includes("apple")) {
  console.log("We have apples!");
}
```

---

## 4. Array Iteration Methods

These methods accept a **callback function** and iterate over the array. They are the cornerstone of **functional** JavaScript programming. All of them (except `forEach`) return a new value and never mutate the original array.

### 4.1 `forEach`

Executes a callback for each element. Returns `undefined`. Use it when you only care about side effects (e.g., logging).

```js
const prices = [10, 25, 50, 75];

prices.forEach((price, index) => {
  console.log(`Item ${index + 1}: $${price}`);
});
// Item 1: $10
// Item 2: $25
// Item 3: $50
// Item 4: $75
```

### 4.2 `map`

Creates a **new array** by transforming each element with the callback. The new array has the same length as the original.

```js
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]
console.log(numbers);  // [1, 2, 3, 4, 5] — unchanged

// Transform an array of objects
const users = [
  { name: "Alice", age: 30 },
  { name: "Bob",   age: 25 },
];
const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob']

// Add a computed property to each object
const withSenior = users.map(user => ({
  ...user,
  isSenior: user.age >= 30,
}));
console.log(withSenior);
// [{ name: 'Alice', age: 30, isSenior: true }, { name: 'Bob', age: 25, isSenior: false }]
```

### 4.3 `filter`

Creates a **new array** containing only the elements for which the callback returns `true`.

```js
const scores = [45, 72, 88, 30, 95, 61];

// Keep scores above 60
const passing = scores.filter(score => score > 60);
console.log(passing); // [72, 88, 95, 61]

// Filter objects
const products = [
  { name: "Laptop", inStock: true },
  { name: "Phone",  inStock: false },
  { name: "Tablet", inStock: true },
];
const available = products.filter(p => p.inStock);
console.log(available); // [{ name: 'Laptop', ... }, { name: 'Tablet', ... }]
```

### 4.4 `reduce`

Reduces the array to a **single value** by accumulating results. It takes a callback and an initial value.

```js
// reduce(callback(accumulator, currentValue, index, array), initialValue)

const nums = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// Find the maximum value
const max = nums.reduce((acc, n) => (n > acc ? n : acc), -Infinity);
console.log(max); // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, cherry: 1 }

// Group objects by a property
const people = [
  { name: "Alice", dept: "Engineering" },
  { name: "Bob",   dept: "Design" },
  { name: "Carol", dept: "Engineering" },
];
const byDept = people.reduce((acc, person) => {
  const key = person.dept;
  if (!acc[key]) acc[key] = [];
  acc[key].push(person);
  return acc;
}, {});
console.log(byDept);
// { Engineering: [{...Alice}, {...Carol}], Design: [{...Bob}] }
```

### 4.5 `find` and `findIndex`

```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
];

// find — returns the first matching ELEMENT, or undefined
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: 'Bob' }

// findIndex — returns the first matching INDEX, or -1
const idx = users.findIndex(u => u.name === "Carol");
console.log(idx); // 2
```

### 4.6 `some` and `every`

```js
const ages = [16, 22, 30, 14, 25];

// some — true if AT LEAST ONE element satisfies the condition
const hasAdult = ages.some(age => age >= 18);
console.log(hasAdult); // true

// every — true if ALL elements satisfy the condition
const allAdults = ages.every(age => age >= 18);
console.log(allAdults); // false

// Practical validation
const formFields = [
  { name: "email",    filled: true  },
  { name: "password", filled: true  },
  { name: "username", filled: false },
];
const allFilled = formFields.every(f => f.filled);
console.log(allFilled ? "Form is valid" : "Please fill all fields");
// "Please fill all fields"
```

### 4.7 `flat` and `flatMap`

```js
// flat — flattens nested arrays to a specified depth (default: 1)
const nested = [1, [2, 3], [4, [5, 6]]];

console.log(nested.flat());    // [1, 2, 3, 4, [5, 6]] — depth 1
console.log(nested.flat(2));   // [1, 2, 3, 4, 5, 6]   — depth 2
console.log(nested.flat(Infinity)); // fully flatten any depth

// flatMap — map + flat(1) in one step (very common pattern)
const sentences = ["Hello World", "Foo Bar"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words); // ['Hello', 'World', 'Foo', 'Bar']

// Another example: expand rows
const orders = [
  { id: 1, items: ["shirt", "pants"] },
  { id: 2, items: ["hat"] },
];
const allItems = orders.flatMap(order => order.items);
console.log(allItems); // ['shirt', 'pants', 'hat']
```

### 4.8 Chaining Iteration Methods

Because `map`, `filter`, and similar methods return new arrays, they can be **chained** together for expressive data pipelines.

```js
const employees = [
  { name: "Alice",   dept: "Engineering", salary: 90000 },
  { name: "Bob",     dept: "Design",      salary: 75000 },
  { name: "Carol",   dept: "Engineering", salary: 110000 },
  { name: "Dave",    dept: "Engineering", salary: 85000 },
  { name: "Eve",     dept: "Design",      salary: 80000 },
];

// Get the names of Engineering employees earning over 85k, sorted alphabetically
const result = employees
  .filter(e => e.dept === "Engineering" && e.salary > 85000)
  .map(e => e.name)
  .sort();

console.log(result); // ['Alice', 'Carol']
```

---

## 5. Destructuring

**Destructuring** lets you unpack values from arrays or properties from objects into distinct variables with a compact syntax.

### 5.1 Array Destructuring

```js
const rgb = [255, 128, 0];

// Without destructuring
const r1 = rgb[0];
const g1 = rgb[1];
const b1 = rgb[2];

// With destructuring — positions matter
const [r, g, b] = rgb;
console.log(r, g, b); // 255 128 0

// Skip elements using commas
const [first, , third] = rgb;
console.log(first, third); // 255 0

// Swap variables in one line
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1

// From a function return value
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min, max); // 1 9
```

### 5.2 Object Destructuring

```js
const user = { name: "Diana", age: 29, city: "Paris" };

// Without destructuring
const name1 = user.name;
const age1  = user.age;

// With destructuring — property names matter (order doesn't)
const { name, age, city } = user;
console.log(name, age, city); // "Diana" 29 "Paris"

// Destructure inside a function parameter
function greet({ name, city }) {
  console.log(`Hello ${name} from ${city}!`);
}
greet(user); // "Hello Diana from Paris!"
```

### 5.3 Default Values

Provide a fallback for properties or array positions that may be `undefined`.

```js
// Array destructuring with defaults
const [a = 0, b = 0, c = 0] = [1, 2];
console.log(a, b, c); // 1 2 0 (c used the default)

// Object destructuring with defaults
const { name = "Guest", role = "user", theme = "light" } = { name: "Alice" };
console.log(name, role, theme); // "Alice" "user" "light"
```

### 5.4 Renaming Variables

Use `:` to assign the destructured value to a different variable name.

```js
const response = { statusCode: 200, body: "OK" };

// Rename statusCode → status, body → message
const { statusCode: status, body: message } = response;
console.log(status);  // 200
console.log(message); // "OK"

// Combine rename with default
const { timeout: ms = 3000 } = {};
console.log(ms); // 3000
```

### 5.5 Nested Destructuring

```js
const config = {
  server: {
    host: "localhost",
    port: 8080,
  },
  database: {
    name: "mydb",
    credentials: {
      user: "admin",
      password: "secret",
    },
  },
};

// Destructure nested objects
const {
  server: { host, port },
  database: { name: dbName, credentials: { user } },
} = config;

console.log(host);   // "localhost"
console.log(port);   // 8080
console.log(dbName); // "mydb"
console.log(user);   // "admin"

// Nested array destructuring
const matrix = [[1, 2], [3, 4], [5, 6]];
const [[topLeft, topRight], [midLeft]] = matrix;
console.log(topLeft, topRight, midLeft); // 1 2 3
```

### 5.6 Destructuring in Loops

```js
const people = [
  { name: "Alice", age: 30 },
  { name: "Bob",   age: 25 },
];

// Destructure each element directly in the for...of loop
for (const { name, age } of people) {
  console.log(`${name} is ${age} years old.`);
}

// With Object.entries — destructure [key, value] pairs
const scores = { Math: 95, Science: 88, English: 92 };
for (const [subject, score] of Object.entries(scores)) {
  console.log(`${subject}: ${score}`);
}
```

---

## 6. Spread and Rest

The `...` syntax serves two purposes depending on context:
- **Spread** — expands an iterable/object into individual elements (used in expressions)
- **Rest** — collects multiple elements into a single array/object (used in patterns/parameters)

### 6.1 Spread with Arrays

```js
const a = [1, 2, 3];
const b = [4, 5, 6];

// Clone an array (shallow copy)
const clone = [...a];
clone.push(99);
console.log(a);     // [1, 2, 3] — original unchanged
console.log(clone); // [1, 2, 3, 99]

// Merge arrays
const merged = [...a, ...b];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// Insert elements in between
const inserted = [...a, 99, 100, ...b];
console.log(inserted); // [1, 2, 3, 99, 100, 4, 5, 6]

// Pass array as function arguments
function sum(x, y, z) { return x + y + z; }
const nums = [1, 2, 3];
console.log(sum(...nums)); // 6

// Spread a string into characters
const chars = [..."hello"];
console.log(chars); // ['h', 'e', 'l', 'l', 'o']
```

### 6.2 Spread with Objects

```js
const defaults = { theme: "light", lang: "en", fontSize: 14 };
const userPrefs = { theme: "dark", fontSize: 16 };

// Shallow clone
const copy = { ...defaults };

// Merge — later properties override earlier ones
const merged = { ...defaults, ...userPrefs };
console.log(merged); // { theme: 'dark', lang: 'en', fontSize: 16 }

// Add or override specific properties
const updated = { ...defaults, lang: "fr", notifications: true };
console.log(updated);
// { theme: 'light', lang: 'fr', fontSize: 14, notifications: true }
```

> **Important:** Spread creates a **shallow copy**. Nested objects are still shared references.

```js
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };

copy.a = 99;           // ✅ doesn't affect original
copy.nested.b = 99;    // ❌ DOES affect original — same reference!

console.log(original.a);        // 1 (safe)
console.log(original.nested.b); // 99 (mutated!)
```

### 6.3 Rest in Array Destructuring

The **rest element** collects remaining elements into a new array. It must be the **last** element.

```js
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Ignore the first two, keep the rest
const [, , ...remaining] = ["a", "b", "c", "d"];
console.log(remaining); // ['c', 'd']
```

### 6.4 Rest in Object Destructuring

```js
const { name, age, ...rest } = { name: "Alice", age: 30, city: "Paris", role: "admin" };
console.log(name); // "Alice"
console.log(age);  // 30
console.log(rest); // { city: 'Paris', role: 'admin' }

// Practical: separate known props from unknown extras
function createUser({ name, email, ...metadata }) {
  console.log(`Creating user: ${name} (${email})`);
  console.log("Extra fields:", metadata);
}

createUser({ name: "Bob", email: "bob@example.com", referral: "friend", plan: "pro" });
// Creating user: Bob (bob@example.com)
// Extra fields: { referral: 'friend', plan: 'pro' }
```

### 6.5 Rest Parameters in Functions

Rest parameters collect any number of remaining function arguments into an array.

```js
// Collect all arguments
function logAll(...args) {
  console.log(args);
}
logAll(1, 2, 3, "four"); // [1, 2, 3, 'four']

// First params fixed, rest collected
function createTag(tag, ...classes) {
  return `<${tag} class="${classes.join(" ")}">`;
}
console.log(createTag("div", "card", "featured", "dark"));
// '<div class="card featured dark">'

// vs the old arguments object (avoid this)
function oldWay() {
  // arguments is array-like, not a real array — no .map(), .filter() etc.
  console.log(Array.from(arguments));
}
```

> **Rest parameters vs `arguments`:** Always prefer rest parameters (`...args`) over the `arguments` object. Rest gives you a true array with all array methods available.

---

## 7. Practical Patterns

### 7.1 Immutable Object Updates

When working with state (especially in React), always return a new object instead of mutating the original.

```js
const state = { user: "Alice", count: 0, active: true };

// ❌ Mutation — avoid
state.count = 1;

// ✅ Immutable update using spread
const newState = { ...state, count: 1 };
console.log(state.count);    // 0 — original preserved
console.log(newState.count); // 1
```

### 7.2 Removing a Property Immutably

```js
const user = { id: 1, name: "Alice", password: "secret123" };

// Use rest destructuring to create an object without the unwanted property
const { password, ...safeUser } = user;
console.log(safeUser); // { id: 1, name: 'Alice' }
```

### 7.3 Building a Data Pipeline

```js
const orders = [
  { id: 1, product: "Laptop",  price: 999,  qty: 1, shipped: true  },
  { id: 2, product: "Mouse",   price: 25,   qty: 3, shipped: false },
  { id: 3, product: "Monitor", price: 399,  qty: 2, shipped: true  },
  { id: 4, product: "Keyboard",price: 79,   qty: 2, shipped: false },
];

const totalRevenue = orders
  .filter(o => o.shipped)          // only shipped orders
  .map(o => o.price * o.qty)       // calculate line total
  .reduce((sum, total) => sum + total, 0); // sum all totals

console.log(`Total revenue: $${totalRevenue}`); // Total revenue: $1797
```

### 7.4 Safe Function Arguments with Destructuring and Defaults

```js
function createButton({
  label = "Click me",
  type = "button",
  disabled = false,
  onClick = () => {},
} = {}) {
  return { label, type, disabled, onClick };
}

console.log(createButton({ label: "Submit", type: "submit" }));
// { label: 'Submit', type: 'submit', disabled: false, onClick: [Function] }

console.log(createButton()); // all defaults used — note the `= {}` fallback
// { label: 'Click me', type: 'button', disabled: false, onClick: [Function] }
```

---

## Further Reading

- [MDN — Working with Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [MDN — Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN — Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN — Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [JavaScript.info — Objects](https://javascript.info/object)
- [JavaScript.info — Arrays](https://javascript.info/array)
- [JavaScript.info — Array methods](https://javascript.info/array-methods)
- [JavaScript.info — Destructuring](https://javascript.info/destructuring-assignment)
