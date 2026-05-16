# Chapter 10: Design Patterns & Paradigms (Advanced)

## Overview

Design patterns are reusable solutions to commonly occurring problems in software design. They are not ready-made code snippets — they are blueprints or templates that you adapt to your situation. Learning patterns trains you to think in proven structures, making your code more readable, maintainable, and scalable.

This chapter covers four major areas:
1. **Object-Oriented JS** — Creational, Structural, and Behavioral design patterns
2. **Functional Programming** — Pure functions, Immutability, Currying, and Composition
3. **Reactive Programming** — RxJS basics and the reactive paradigm
4. **Modularity Patterns** — IIFE, UMD, CommonJS, and ESM

---

## 1. Object-Oriented JS — Design Patterns

Design patterns in OOP were popularized by the *Gang of Four* (GoF) book *"Design Patterns: Elements of Reusable Object-Oriented Software"* (1994). They are grouped into three categories:

| Category | Purpose | Examples |
|---|---|---|
| **Creational** | How objects are created | Singleton, Factory, Builder, Prototype |
| **Structural** | How objects are composed | Decorator, Adapter, Facade, Proxy |
| **Behavioral** | How objects communicate | Observer, Strategy, Command, Iterator |

---

### 1.1 Creational Patterns

Creational patterns abstract the object creation process, making your system independent of how its objects are created, composed, and represented.

---

#### Singleton

Ensures a class has **only one instance** and provides a global access point to it.

**When to use:** Configuration managers, logging services, database connection pools, global state stores.

```js
class AppConfig {
  constructor() {
    if (AppConfig._instance) {
      return AppConfig._instance;
    }
    // Initialize config only once
    this.theme = 'light';
    this.language = 'en';
    AppConfig._instance = this;
  }

  setTheme(theme) {
    this.theme = theme;
  }

  getTheme() {
    return this.theme;
  }
}

const config1 = new AppConfig();
const config2 = new AppConfig();

config1.setTheme('dark');

console.log(config2.getTheme()); // 'dark' — same instance!
console.log(config1 === config2); // true
```

> **Modern alternative using module scope:**
> ES modules are singletons by nature — a module is only evaluated once, so any value exported is shared across all importers.

```js
// config.js
export const config = {
  theme: 'light',
  language: 'en',
};

// main.js
import { config } from './config.js';
config.theme = 'dark';

// other.js
import { config } from './config.js';
console.log(config.theme); // 'dark' — same object reference
```

---

#### Factory

A **Factory** provides an interface for creating objects without specifying the exact class or constructor. It encapsulates the creation logic.

**When to use:** When the type of object to create is determined at runtime, or when creation involves complex logic.

```js
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'Car';
  }
}

class Truck {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'Truck';
    this.hasCargo = true;
  }
}

class Motorcycle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
    this.type = 'Motorcycle';
  }
}

// Factory function
function VehicleFactory(type, make, model) {
  const vehicles = { Car, Truck, Motorcycle };
  const VehicleClass = vehicles[type];
  if (!VehicleClass) {
    throw new Error(`Unknown vehicle type: ${type}`);
  }
  return new VehicleClass(make, model);
}

const car = VehicleFactory('Car', 'Toyota', 'Corolla');
const truck = VehicleFactory('Truck', 'Ford', 'F-150');

console.log(car.type);  // 'Car'
console.log(truck.hasCargo);  // true
```

**Abstract Factory** — a factory that creates families of related objects:

```js
// UI component factory abstraction
function createButtonFactory(theme) {
  if (theme === 'material') {
    return {
      createButton: (label) => ({ type: 'MaterialButton', label, rounded: true }),
      createInput: (placeholder) => ({ type: 'MaterialInput', placeholder, underline: true }),
    };
  }
  if (theme === 'bootstrap') {
    return {
      createButton: (label) => ({ type: 'BootstrapButton', label, bordered: true }),
      createInput: (placeholder) => ({ type: 'BootstrapInput', placeholder }),
    };
  }
  throw new Error('Unknown theme');
}

const materialUI = createButtonFactory('material');
const btn = materialUI.createButton('Submit');
console.log(btn); // { type: 'MaterialButton', label: 'Submit', rounded: true }
```

---

#### Builder

Separates the construction of a **complex object** from its representation, allowing the same construction process to create different representations. Particularly useful for objects with many optional parameters.

**When to use:** Building complex objects step-by-step (SQL queries, HTTP requests, form schemas, configuration objects).

```js
class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.conditions = [];
    this.selectedFields = ['*'];
    this.limitValue = null;
    this.orderByField = null;
  }

  select(...fields) {
    this.selectedFields = fields;
    return this; // enables method chaining
  }

  where(condition) {
    this.conditions.push(condition);
    return this;
  }

  limit(n) {
    this.limitValue = n;
    return this;
  }

  orderBy(field) {
    this.orderByField = field;
    return this;
  }

  build() {
    let query = `SELECT ${this.selectedFields.join(', ')} FROM ${this.table}`;
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    if (this.orderByField) {
      query += ` ORDER BY ${this.orderByField}`;
    }
    if (this.limitValue !== null) {
      query += ` LIMIT ${this.limitValue}`;
    }
    return query;
  }
}

const query = new QueryBuilder('users')
  .select('id', 'name', 'email')
  .where('age > 18')
  .where('active = true')
  .orderBy('name')
  .limit(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND active = true ORDER BY name LIMIT 10
```

---

#### Prototype

Creates new objects by **cloning an existing object** (the prototype). JavaScript's entire inheritance system is prototype-based.

```js
const animalPrototype = {
  speak() {
    return `${this.name} says ${this.sound}`;
  },
  describe() {
    return `I am a ${this.species}`;
  }
};

function createAnimal(name, sound, species) {
  // Object.create sets the prototype chain
  const animal = Object.create(animalPrototype);
  animal.name = name;
  animal.sound = sound;
  animal.species = species;
  return animal;
}

const dog = createAnimal('Rex', 'Woof', 'Dog');
const cat = createAnimal('Whiskers', 'Meow', 'Cat');

console.log(dog.speak());    // 'Rex says Woof'
console.log(cat.describe()); // 'I am a Cat'
console.log(Object.getPrototypeOf(dog) === animalPrototype); // true
```

---

### 1.2 Structural Patterns

Structural patterns deal with object composition — how to combine objects and classes into larger structures while keeping them flexible and efficient.

---

#### Decorator

Attaches additional responsibilities to an object **dynamically** without modifying its class. It wraps the original object and extends its behavior.

**When to use:** Adding features to objects without altering their class (logging, caching, validation, authorization).

```js
// Base coffee class
class Coffee {
  cost() { return 2; }
  description() { return 'Basic Coffee'; }
}

// Decorators
class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 0.5; }
  description() { return this.coffee.description() + ', Milk'; }
}

class SyrupDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 0.75; }
  description() { return this.coffee.description() + ', Syrup'; }
}

class WhipDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 0.6; }
  description() { return this.coffee.description() + ', Whipped Cream'; }
}

let myCoffee = new Coffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SyrupDecorator(myCoffee);
myCoffee = new WhipDecorator(myCoffee);

console.log(myCoffee.description()); // 'Basic Coffee, Milk, Syrup, Whipped Cream'
console.log(myCoffee.cost());        // 3.85
```

> **JavaScript native decorators** are a Stage 3 TC39 proposal and used heavily in TypeScript (Angular, NestJS):

```ts
// TypeScript/Angular example — decorator syntax
@Component({ selector: 'app-root' })
class AppComponent { }

@Injectable()
class UserService { }
```

---

#### Adapter

Converts the **interface of a class into another interface** that clients expect. It allows classes with incompatible interfaces to work together.

**When to use:** Integrating legacy code, third-party libraries with different APIs.

```js
// Legacy payment system
class LegacyPaymentSystem {
  makePayment(dollarAmount) {
    console.log(`Processing $${dollarAmount} via Legacy System`);
    return { success: true, legacyRef: `LEG-${Date.now()}` };
  }
}

// New system expects a different interface
class ModernPaymentAdapter {
  constructor(legacySystem) {
    this.legacy = legacySystem;
  }

  // Adapts: pay({ amount, currency }) → makePayment(dollarAmount)
  pay({ amount, currency }) {
    const dollarAmount = currency === 'EUR' ? amount * 1.1 : amount;
    const result = this.legacy.makePayment(dollarAmount);
    return {
      transactionId: result.legacyRef,
      status: result.success ? 'completed' : 'failed',
    };
  }
}

const legacy = new LegacyPaymentSystem();
const adapter = new ModernPaymentAdapter(legacy);

const result = adapter.pay({ amount: 100, currency: 'EUR' });
console.log(result); // { transactionId: 'LEG-...', status: 'completed' }
```

---

#### Facade

Provides a **simplified interface** to a complex subsystem. It hides the complexity of the underlying system and exposes only what is needed.

**When to use:** Simplifying complex APIs, wrapping subsystems, creating easy-to-use SDK interfaces.

```js
// Complex subsystems
class AudioSystem {
  initialize() { console.log('Audio initialized'); }
  setVolume(level) { console.log(`Volume set to ${level}`); }
  playTrack(track) { console.log(`Playing: ${track}`); }
}

class VideoSystem {
  initialize() { console.log('Video initialized'); }
  setResolution(res) { console.log(`Resolution: ${res}`); }
  loadVideo(file) { console.log(`Loading video: ${file}`); }
}

class SubtitleSystem {
  loadSubtitles(file) { console.log(`Subtitles loaded: ${file}`); }
  enable() { console.log('Subtitles enabled'); }
}

// Facade — simple interface to all subsystems
class MediaPlayerFacade {
  constructor() {
    this.audio = new AudioSystem();
    this.video = new VideoSystem();
    this.subtitles = new SubtitleSystem();
  }

  play(videoFile, subtitleFile = null) {
    this.audio.initialize();
    this.video.initialize();
    this.audio.setVolume(80);
    this.video.setResolution('1080p');
    this.video.loadVideo(videoFile);
    if (subtitleFile) {
      this.subtitles.loadSubtitles(subtitleFile);
      this.subtitles.enable();
    }
    this.audio.playTrack(videoFile);
  }
}

const player = new MediaPlayerFacade();
player.play('movie.mp4', 'movie.srt');
// All subsystems initialized and configured with a single call
```

---

#### Proxy

Provides a **surrogate or placeholder** for another object to control access to it. The proxy intercepts operations on the target object.

**When to use:** Lazy loading, access control, caching, logging, validation.

```js
const handler = {
  get(target, prop) {
    if (prop in target) {
      console.log(`[LOG] Getting property: ${prop}`);
      return target[prop];
    }
    throw new Error(`Property "${prop}" does not exist`);
  },
  set(target, prop, value) {
    if (typeof value !== 'number' || value < 0) {
      throw new RangeError(`Invalid value for "${prop}": must be a non-negative number`);
    }
    console.log(`[LOG] Setting ${prop} = ${value}`);
    target[prop] = value;
    return true;
  }
};

const inventory = new Proxy({ apples: 10, oranges: 5 }, handler);

console.log(inventory.apples); // [LOG] Getting property: apples → 10
inventory.oranges = 20;        // [LOG] Setting oranges = 20
inventory.apples = -1;         // Throws RangeError
```

---

### 1.3 Behavioral Patterns

Behavioral patterns focus on communication and responsibility between objects, defining how objects interact and distribute responsibility.

---

#### Observer (Publish/Subscribe)

Defines a **one-to-many dependency** between objects. When one object (subject/publisher) changes state, all its dependents (observers/subscribers) are notified automatically.

**When to use:** Event systems, state management, real-time data feeds, notifications.

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

// Usage
const store = new EventEmitter();

const unsubscribe = store.on('userLoggedIn', (user) => {
  console.log(`Welcome, ${user.name}!`);
});

store.on('userLoggedIn', (user) => {
  console.log(`Logging activity for user: ${user.id}`);
});

store.emit('userLoggedIn', { id: 42, name: 'Alice' });
// Welcome, Alice!
// Logging activity for user: 42

unsubscribe(); // Remove first listener
store.emit('userLoggedIn', { id: 43, name: 'Bob' });
// Only: Logging activity for user: 43
```

> **Real-world usage:** This pattern is the foundation of the browser's DOM `addEventListener`, Node.js `EventEmitter`, Redux, and React's Context API.

---

#### Strategy

Defines a **family of algorithms**, encapsulates each one, and makes them interchangeable. Lets you select the algorithm to use at runtime.

**When to use:** Sorting strategies, payment methods, validation rules, compression algorithms.

```js
// Sorting strategies
const bubbleSort = (arr) => {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
};

const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const mid = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
};

const nativeSort = (arr) => [...arr].sort((a, b) => a - b);

// Context that uses the strategy
class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    return this.strategy(data);
  }
}

const sorter = new Sorter(nativeSort);
console.log(sorter.sort([5, 3, 8, 1, 9, 2])); // [1, 2, 3, 5, 8, 9]

sorter.setStrategy(quickSort);
console.log(sorter.sort([5, 3, 8, 1, 9, 2])); // [1, 2, 3, 5, 8, 9]
```

---

#### Command

Encapsulates a **request as an object**, letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

**When to use:** Undo/redo systems, task queues, macros, transactional operations.

```js
class TextEditor {
  constructor() {
    this.content = '';
    this.history = [];
    this.undoStack = [];
  }

  executeCommand(command) {
    command.execute();
    this.history.push(command);
    this.undoStack = []; // Clear redo stack on new command
  }

  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
      this.undoStack.push(command);
    }
  }

  redo() {
    const command = this.undoStack.pop();
    if (command) {
      command.execute();
      this.history.push(command);
    }
  }
}

class InsertCommand {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.content += this.text;
  }

  undo() {
    this.editor.content = this.editor.content.slice(0, -this.text.length);
  }
}

class DeleteCommand {
  constructor(editor, count) {
    this.editor = editor;
    this.count = count;
    this.deleted = '';
  }

  execute() {
    this.deleted = this.editor.content.slice(-this.count);
    this.editor.content = this.editor.content.slice(0, -this.count);
  }

  undo() {
    this.editor.content += this.deleted;
  }
}

const editor = new TextEditor();
editor.executeCommand(new InsertCommand(editor, 'Hello'));
editor.executeCommand(new InsertCommand(editor, ', World'));
console.log(editor.content); // 'Hello, World'

editor.undo();
console.log(editor.content); // 'Hello'

editor.redo();
console.log(editor.content); // 'Hello, World'

editor.executeCommand(new DeleteCommand(editor, 6));
console.log(editor.content); // 'Hello'
```

---

#### Iterator

Provides a way to **sequentially access elements** of a collection without exposing its underlying representation. JavaScript has built-in iterator protocol.

```js
// Custom range iterator
function createRange(start, end, step = 1) {
  return {
    [Symbol.iterator]() {
      let current = start;
      return {
        next() {
          if (current <= end) {
            const value = current;
            current += step;
            return { value, done: false };
          }
          return { value: undefined, done: true };
        }
      };
    }
  };
}

const range = createRange(1, 10, 2);
for (const num of range) {
  process.stdout.write(num + ' '); // 1 3 5 7 9
}
console.log();

// Spread into array
console.log([...createRange(0, 6, 3)]); // [0, 3, 6]
```

---

## 2. Functional Programming (FP)

Functional Programming is a **programming paradigm** that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data. In JavaScript, FP is not enforced by the language — it is a discipline you choose to apply.

### Core Principles

| Principle | Description |
|---|---|
| **Pure Functions** | Same input → always same output, no side effects |
| **Immutability** | Data is never changed, new data is created |
| **First-Class Functions** | Functions are values; can be passed, returned, assigned |
| **Higher-Order Functions** | Functions that take/return other functions |
| **Currying** | Transform multi-arg function into chain of single-arg functions |
| **Composition** | Combine small functions to build complex behavior |
| **Declarative style** | Describe *what* to do, not *how* |

---

### 2.1 Pure Functions

A **pure function**:
- Returns the **same result** for the same arguments (deterministic)
- Has **no side effects** (does not modify external state, no I/O, no mutations)

```js
// IMPURE — depends on external state, has side effect
let discount = 0.1;
function applyDiscount(price) {
  return price - price * discount; // depends on external `discount`
}

// PURE — same input always gives same output, no side effects
function applyDiscountPure(price, discountRate) {
  return price - price * discountRate;
}

console.log(applyDiscountPure(100, 0.1)); // 90 — always
console.log(applyDiscountPure(100, 0.1)); // 90 — always
```

**Why pure functions matter:**
- **Testability**: Easy to unit test — no mocking required
- **Predictability**: No surprises from hidden state
- **Memoization**: Results can be safely cached
- **Parallelism**: Safe to run concurrently (no shared state conflicts)

```js
// Pure array transformations (no mutation)
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);       // [2, 4, 6, 8, 10]
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

console.log(numbers); // [1, 2, 3, 4, 5] — original unchanged
```

---

### 2.2 Immutability

**Immutability** means once data is created, it is never changed. Instead of mutating, you create new data structures with the desired changes.

```js
// MUTABLE — mutates original (bad in FP)
const user = { name: 'Alice', age: 25 };
user.age = 26; // mutates!

// IMMUTABLE — creates new object
const user = { name: 'Alice', age: 25 };
const updatedUser = { ...user, age: 26 }; // spread creates new object

console.log(user.age);        // 25 — unchanged
console.log(updatedUser.age); // 26 — new object

// IMMUTABLE array operations
const fruits = ['apple', 'banana', 'cherry'];

// Add item
const withMango = [...fruits, 'mango'];

// Remove item (index 1)
const withoutBanana = fruits.filter((_, i) => i !== 1);

// Update item (index 0)
const updated = fruits.map((f, i) => i === 0 ? 'avocado' : f);

console.log(fruits);       // ['apple', 'banana', 'cherry'] — unchanged
console.log(withMango);    // ['apple', 'banana', 'cherry', 'mango']
console.log(withoutBanana); // ['apple', 'cherry']
```

**Deep immutability with `Object.freeze`:**

```js
const config = Object.freeze({
  api: Object.freeze({
    baseUrl: 'https://api.example.com',
    timeout: 5000,
  }),
  version: '1.0.0',
});

config.version = '2.0.0';       // Silently fails (or throws in strict mode)
config.api.timeout = 10000;     // Also fails — nested freeze
console.log(config.version);    // '1.0.0'
```

> **Note:** `Object.freeze` is shallow by default. For deep immutability in production use libraries like **Immer** or **Immutable.js**.

---

### 2.3 Higher-Order Functions

A **higher-order function (HOF)** either:
- Takes one or more functions as arguments, **or**
- Returns a function as its result

JavaScript's built-in HOFs: `map`, `filter`, `reduce`, `forEach`, `sort`, `find`, `every`, `some`.

```js
// map: transform each element
const prices = [10, 20, 30, 40];
const withTax = prices.map(p => p * 1.2);
console.log(withTax); // [12, 24, 36, 48]

// filter: keep elements matching condition
const expensiveItems = prices.filter(p => p > 15);
console.log(expensiveItems); // [20, 30, 40]

// reduce: accumulate into a single value
const total = prices.reduce((sum, p) => sum + p, 0);
console.log(total); // 100

// Returning a function (HOF as factory)
function createMultiplier(factor) {
  return (number) => number * factor;
}
const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

### 2.4 Currying

**Currying** transforms a function that takes multiple arguments into a sequence of functions, each taking a **single argument**.

Named after mathematician Haskell Curry.

```js
// Regular (uncurried) function
function add(a, b, c) {
  return a + b + c;
}

// Curried version — manual
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Using arrow functions (more concise)
const multiply = a => b => a * b;
const double = multiply(2);
const triple = multiply(3);

console.log(double(5));  // 10
console.log(triple(4));  // 12

// Generic curry utility
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

const curriedMultiply = curry((a, b, c) => a * b * c);
console.log(curriedMultiply(2)(3)(4));    // 24
console.log(curriedMultiply(2, 3)(4));    // 24
console.log(curriedMultiply(2)(3, 4));    // 24
console.log(curriedMultiply(2, 3, 4));    // 24
```

**Practical use — partial application:**

```js
const curriedFetch = (baseUrl) => (endpoint) => (options = {}) =>
  fetch(`${baseUrl}${endpoint}`, options);

const apiCall = curriedFetch('https://api.example.com');
const getUsers = apiCall('/users');
const getProducts = apiCall('/products');

// Later in your code — no need to repeat the base URL
getUsers({ method: 'GET' });
getProducts({ method: 'GET' });
```

---

### 2.5 Function Composition

**Composition** is the practice of combining two or more functions to produce a new function. The output of one function becomes the input of the next.

Mathematically: `(f ∘ g)(x) = f(g(x))`

```js
// Compose — right to left (mathematical convention)
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

// Pipe — left to right (more readable for most devs)
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

// Small, focused pure functions
const trim = str => str.trim();
const toUpperCase = str => str.toUpperCase();
const addExclamation = str => `${str}!`;
const removeSpaces = str => str.replace(/\s+/g, '_');

// Compose (right to left): addExclamation(toUpperCase(trim(str)))
const shout = compose(addExclamation, toUpperCase, trim);
console.log(shout('  hello world  ')); // 'HELLO WORLD!'

// Pipe (left to right) — same result, more readable
const formatUsername = pipe(trim, toUpperCase, removeSpaces);
console.log(formatUsername('  john doe  ')); // 'JOHN_DOE'
```

**Real-world composition example — data transformation pipeline:**

```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const parseJSON = (str) => JSON.parse(str);
const extractUsers = (data) => data.users;
const filterActive = (users) => users.filter(u => u.active);
const sortByName = (users) => [...users].sort((a, b) => a.name.localeCompare(b.name));
const pickNames = (users) => users.map(u => u.name);

const processUsers = pipe(
  parseJSON,
  extractUsers,
  filterActive,
  sortByName,
  pickNames,
);

const rawData = '{"users":[{"name":"Charlie","active":true},{"name":"Alice","active":false},{"name":"Bob","active":true}]}';
console.log(processUsers(rawData)); // ['Bob', 'Charlie']
```

---

## 3. Reactive Programming Paradigms (RxJS Basics)

**Reactive Programming** is a paradigm centered around **data streams** and the **propagation of change**. Instead of asking for data ("pull"), you subscribe to data that arrives over time ("push").

### Core Concept: Observable Streams

| Concept | Description |
|---|---|
| **Observable** | A stream of values over time |
| **Observer** | Consumes values from an Observable |
| **Subscription** | The connection between Observable and Observer |
| **Operators** | Functions that transform streams (like `map`, `filter` for arrays) |
| **Subject** | Both an Observable and an Observer (acts as event bus) |
| **Scheduler** | Controls when/how values are emitted |

### Thinking Reactively

```
Traditional (Imperative):
  const result = fetchData();       // blocks or uses callbacks
  process(result);

Reactive:
  fetchData$
    .pipe(map(process))
    .subscribe(console.log);        // non-blocking, declarative
```

### 3.1 Getting Started with RxJS

```bash
npm install rxjs
```

```js
import { Observable, of, from, interval, fromEvent } from 'rxjs';
import { map, filter, take, debounceTime, switchMap } from 'rxjs/operators';
```

---

### 3.2 Creating Observables

```js
import { Observable, of, from, interval, fromEvent } from 'rxjs';

// 1. Creating from scratch
const custom$ = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

custom$.subscribe({
  next: (value) => console.log('Value:', value),
  error: (err) => console.error('Error:', err),
  complete: () => console.log('Stream completed'),
});
// Value: 1
// Value: 2
// Value: 3
// (after 1 second)
// Value: 4
// Stream completed

// 2. of — creates Observable from static values
of(1, 2, 3).subscribe(console.log); // 1, 2, 3

// 3. from — creates Observable from array, Promise, or iterable
from([10, 20, 30]).subscribe(console.log); // 10, 20, 30
from(fetch('/api/users')).subscribe(response => console.log(response));

// 4. interval — emits incrementing numbers at a fixed interval
const ticker$ = interval(1000); // emits 0, 1, 2, ... every second
```

---

### 3.3 Operators

Operators are **pure functions** that transform observables. They are applied using the `pipe()` method.

```js
import { of, from, interval } from 'rxjs';
import { map, filter, take, reduce, tap } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

numbers$
  .pipe(
    filter(n => n % 2 === 0),   // keep only even numbers: 2, 4, 6, 8, 10
    map(n => n * n),             // square them: 4, 16, 36, 64, 100
    take(3),                     // only take first 3: 4, 16, 36
    tap(n => console.log('Processing:', n)), // side effect for logging
  )
  .subscribe(n => console.log('Result:', n));

// Processing: 4 → Result: 4
// Processing: 16 → Result: 16
// Processing: 36 → Result: 36
```

---

### 3.4 Subject — Multicasting

A `Subject` is both an `Observable` and an `Observer`. Use it to multicast events to multiple subscribers.

```js
import { Subject } from 'rxjs';

const notifications$ = new Subject();

// Multiple subscribers
notifications$.subscribe(msg => console.log(`User 1: ${msg}`));
notifications$.subscribe(msg => console.log(`User 2: ${msg}`));

// Emit values
notifications$.next('New message received');
// User 1: New message received
// User 2: New message received

notifications$.next('Friend request');
// User 1: Friend request
// User 2: Friend request
```

---

### 3.5 Practical: Auto-complete with RxJS

One of the most iconic reactive examples is a search input with debouncing, avoiding unnecessary API calls:

```js
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

const searchInput = document.getElementById('search');

const search$ = fromEvent(searchInput, 'input').pipe(
  map(event => event.target.value.trim()),
  debounceTime(300),           // wait 300ms after last keystroke
  distinctUntilChanged(),      // ignore if value didn't change
  switchMap(query =>           // cancel previous request, start new one
    query ? fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json()) : Promise.resolve([])
  ),
);

search$.subscribe(results => {
  renderResults(results);
});
```

> **Note:** `switchMap` automatically cancels the previous inner Observable (the old fetch) when a new value arrives — this prevents race conditions and stale results.

---

### 3.6 Hot vs Cold Observables

| Type | Description | Example |
|---|---|---|
| **Cold** | Each subscriber gets its own stream from the start | `of()`, `from()`, HTTP requests |
| **Hot** | All subscribers share the same stream | `fromEvent()`, `Subject`, WebSocket |

```js
import { interval } from 'rxjs';
import { share } from 'rxjs/operators';

// Cold — each subscriber starts from 0
const cold$ = interval(1000);
cold$.subscribe(v => console.log('Subscriber A:', v)); // 0, 1, 2...
// (2 seconds later)
cold$.subscribe(v => console.log('Subscriber B:', v)); // 0, 1, 2... (starts fresh!)

// Hot — share makes it multicasted
const hot$ = interval(1000).pipe(share());
hot$.subscribe(v => console.log('Subscriber A:', v)); // 0, 1, 2...
// (2 seconds later)
hot$.subscribe(v => console.log('Subscriber B:', v)); // 2, 3, 4... (joins in-progress)
```

---

## 4. Modularity Patterns

Before ES Modules became standard, developers invented several patterns to organize JavaScript code into modules — units with a defined public interface and private internals. Understanding these helps you read legacy codebases and understand why ESM was created.

---

### 4.1 IIFE (Immediately Invoked Function Expression)

An **IIFE** is a function that is defined and immediately executed. It creates a new function scope, preventing variable leakage into the global scope.

```js
// Basic IIFE syntax
(function () {
  // private scope
  const secret = 'hidden';
  console.log('IIFE runs immediately');
})();

// console.log(secret); // ReferenceError — not accessible outside

// Arrow function IIFE
(() => {
  console.log('Arrow IIFE');
})();
```

**Module pattern using IIFE:**

```js
const CounterModule = (function () {
  // Private state
  let count = 0;

  // Private function
  function validate(n) {
    return typeof n === 'number' && n >= 0;
  }

  // Public API (returned object)
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      if (count > 0) count--;
      return count;
    },
    reset() {
      count = 0;
    },
    getCount() {
      return count;
    },
    setCount(n) {
      if (validate(n)) count = n;
    },
  };
})();

CounterModule.increment(); // 1
CounterModule.increment(); // 2
CounterModule.decrement(); // 1
console.log(CounterModule.getCount()); // 1
console.log(CounterModule.count);      // undefined — private!
```

---

### 4.2 CommonJS (CJS)

**CommonJS** is the module system used by **Node.js**. It uses `require()` to import and `module.exports` to export.

- Modules are loaded **synchronously**
- Each file is its own module (wrapped in a function by Node.js)
- Widely used in server-side JS and legacy bundled frontend code

```js
// math.js (CommonJS module)
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }
const PI = 3.14159;

module.exports = { add, multiply, PI };

// OR using exports shorthand
exports.subtract = (a, b) => a - b;
```

```js
// main.js — consuming the CommonJS module
const math = require('./math');
const { add, PI } = require('./math');

console.log(math.add(2, 3));    // 5
console.log(math.multiply(4, 5)); // 20
console.log(add(10, 20));        // 30
console.log(PI);                 // 3.14159
```

**Dynamic require:**

```js
// CJS supports dynamic requires — loaded at runtime
const moduleName = process.env.NODE_ENV === 'test' ? 'db-mock' : 'db';
const db = require(`./${moduleName}`);
```

> **Limitation:** `require()` is synchronous — not suitable for browsers (network is async). This led to bundlers like Browserify and Webpack.

---

### 4.3 UMD (Universal Module Definition)

**UMD** is a pattern designed to work in multiple environments: browser (as a global), CommonJS (Node.js), and AMD (RequireJS). It's commonly used in libraries that need to work everywhere.

```js
// UMD boilerplate — auto-detects environment
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD (RequireJS)
    define(['dependency'], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS (Node.js)
    module.exports = factory(require('dependency'));
  } else {
    // Browser global
    root.MyLibrary = factory(root.Dependency);
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function (dependency) {
  // Library code
  return {
    greet(name) {
      return `Hello, ${name}!`;
    }
  };
}));
```

> **When you'll encounter UMD:** Most pre-2020 npm packages and CDN-distributed libraries use UMD (e.g., lodash, moment.js, jQuery builds). Modern libraries now ship ESM or dual CJS+ESM packages.

---

### 4.4 ESM (ES Modules / ECMAScript Modules)

**ES Modules** are the official JavaScript module system, standardized in **ES2015 (ES6)**. They are now natively supported in all modern browsers and Node.js (v12+).

**Key characteristics:**
- **Static imports** — resolved at parse time, not runtime
- **Tree-shakeable** — bundlers can remove unused exports
- **Async loading** — browsers load modules non-blocking
- **Live bindings** — imported values update if the exporting module changes them
- **Strict mode** by default inside modules

```js
// math.js — named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// Default export (one per module)
export default function subtract(a, b) { return a - b; }
```

```js
// main.js — importing
import subtract, { PI, add, multiply } from './math.js'; // named + default
import * as math from './math.js';                       // namespace import
import { add as sum } from './math.js';                  // rename import

console.log(PI);            // 3.14159
console.log(add(2, 3));     // 5
console.log(subtract(10, 4)); // 6
console.log(math.multiply(3, 3)); // 9
console.log(sum(1, 1));     // 2
```

**Dynamic imports (code splitting):**

```js
// Import a module lazily — returns a Promise
const button = document.getElementById('load-chart');

button.addEventListener('click', async () => {
  const { renderChart } = await import('./chart.js');
  renderChart(document.getElementById('canvas'), data);
});
```

**Using ESM in browsers:**

```html
<script type="module" src="main.js"></script>

<!-- Inline module -->
<script type="module">
  import { greet } from './utils.js';
  greet('World');
</script>
```

**Using ESM in Node.js:**

```json
// package.json
{
  "type": "module"
}
```

```js
// Now .js files are treated as ESM
import { readFile } from 'fs/promises';
const data = await readFile('./data.json', 'utf8');
```

---

### Modularity Pattern Comparison

| Feature | IIFE | CommonJS | UMD | ESM |
|---|---|---|---|---|
| **Environment** | Browser (legacy) | Node.js | Universal | Browser + Node.js |
| **Load style** | Inline / global | Synchronous | Adaptive | Asynchronous |
| **Tree shaking** | No | No | No | Yes |
| **Static analysis** | No | No | No | Yes |
| **Native browser support** | Yes (any JS) | No | No | Yes (modern) |
| **Dynamic imports** | Via global | `require()` | Via global | `import()` |
| **Strict mode** | No (opt-in) | No (opt-in) | No (opt-in) | Always |
| **Use today?** | Legacy/encapsulation | Node.js legacy | Library compatibility | Preferred |

---

## Summary

| Pattern/Concept | Category | Key Benefit |
|---|---|---|
| Singleton | Creational OOP | Single shared instance |
| Factory | Creational OOP | Decoupled object creation |
| Builder | Creational OOP | Fluent, step-by-step construction |
| Prototype | Creational OOP | Clone-based creation |
| Decorator | Structural OOP | Dynamic behavior extension |
| Adapter | Structural OOP | Interface compatibility |
| Facade | Structural OOP | Simplified API |
| Proxy | Structural OOP | Controlled access |
| Observer | Behavioral OOP | Event-driven communication |
| Strategy | Behavioral OOP | Swappable algorithms |
| Command | Behavioral OOP | Encapsulated, undoable actions |
| Pure Functions | FP | Predictable, testable code |
| Immutability | FP | No unexpected mutations |
| Currying | FP | Partial application, reuse |
| Composition | FP | Build complex from simple |
| Observable | Reactive | Async data streams |
| IIFE | Modularity | Scope encapsulation |
| CommonJS | Modularity | Node.js server modules |
| UMD | Modularity | Cross-environment libraries |
| ESM | Modularity | Modern standard module system |

---

## Further Reading

- [MDN — Design Patterns (JavaScript)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)
- [Refactoring.Guru — Design Patterns](https://refactoring.guru/design-patterns)
- [You Don't Know JS — Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md)
- [Functional-Light JavaScript — Kyle Simpson](https://github.com/getify/Functional-Light-JS)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [MDN — JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Exploring JS — Modules](https://exploringjs.com/es6/ch_modules.html)
