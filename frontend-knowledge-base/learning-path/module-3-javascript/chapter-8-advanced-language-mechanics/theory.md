# Chapter 8: Advanced Language Mechanics (Advanced)

## Overview

This chapter dives into the most powerful and often misunderstood mechanics of JavaScript: how `this` really works, how prototypal inheritance is the backbone of all objects, how closures enable stateful programming, and how iterators, generators, and symbols unlock advanced patterns. Mastering these concepts separates a competent developer from an expert one.

---

## 1. Deep Dive into `this`, Call, Apply, and Bind

### What is `this`?

In JavaScript, `this` is a special keyword that refers to the **execution context** — the object that "owns" the currently running code. Unlike most languages, `this` is **not** determined by where a function is defined, but by **how it is called**.

There are four main rules that determine the value of `this`:

| Rule | Example | `this` value |
|---|---|---|
| Default binding | `foo()` | `globalThis` (or `undefined` in strict mode) |
| Implicit binding | `obj.foo()` | `obj` |
| Explicit binding | `foo.call(obj)` | `obj` |
| `new` binding | `new Foo()` | The newly created object |

> Arrow functions are an exception — they **do not** have their own `this`. They inherit `this` from their surrounding lexical scope.

---

### Rule 1: Default Binding

When a function is called as a plain function (not as a method), `this` defaults to the global object (`window` in browsers, `global` in Node.js). In **strict mode**, it is `undefined`.

```js
function showThis() {
  console.log(this);
}

showThis(); // window (browser) | global (Node.js) | undefined (strict mode)
```

```js
'use strict';
function showThis() {
  console.log(this); // undefined
}
showThis();
```

---

### Rule 2: Implicit Binding

When a function is called as a **method** of an object, `this` refers to the object to the left of the dot.

```js
const user = {
  name: 'Alice',
  greet() {
    console.log(`Hello, I am ${this.name}`);
  }
};

user.greet(); // "Hello, I am Alice"
```

**Implicit binding loss** — a common pitfall:

```js
const user = {
  name: 'Alice',
  greet() {
    console.log(`Hello, I am ${this.name}`);
  }
};

const fn = user.greet; // extracted from the object
fn(); // "Hello, I am undefined" — `this` is no longer `user`
```

When you extract a method and call it as a plain function, implicit binding is lost.

---

### Rule 3: Explicit Binding — `call`, `apply`, and `bind`

You can explicitly set what `this` refers to using three built-in methods on `Function.prototype`.

#### `call(thisArg, arg1, arg2, ...)`

Calls the function immediately with a specified `this` and individual arguments.

```js
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I am ${this.name}${punctuation}`);
}

const person = { name: 'Bob' };

introduce.call(person, 'Hello', '!'); // "Hello, I am Bob!"
```

#### `apply(thisArg, [argsArray])`

Same as `call`, but arguments are passed as an **array**. Useful when arguments are already in an array.

```js
introduce.apply(person, ['Hi', '?']); // "Hi, I am Bob?"

// Practical use: finding max value in an array
const numbers = [3, 1, 8, 4, 2];
const max = Math.max.apply(null, numbers); // 8
// Modern equivalent: Math.max(...numbers)
```

#### `bind(thisArg, arg1, arg2, ...)`

Returns a **new function** with `this` permanently bound. The original function is not called immediately.

```js
const greetBob = introduce.bind(person, 'Hey');
greetBob('!!!'); // "Hey, I am Bob!!!"

// Common use case: fixing `this` for callbacks
const counter = {
  count: 0,
  increment() {
    this.count++;
    console.log(this.count);
  }
};

const btn = document.querySelector('button');
btn.addEventListener('click', counter.increment.bind(counter));
// Without bind, `this` inside increment would be the button element
```

---

### Rule 4: `new` Binding

When a function is called with the `new` keyword, JavaScript:
1. Creates a new empty object `{}`
2. Sets the new object's prototype to the function's `prototype` property
3. Executes the function with `this` set to the new object
4. Returns the new object (unless the function explicitly returns a different object)

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  // implicitly: return this;
}

const alice = new Person('Alice', 30);
console.log(alice.name); // "Alice"
console.log(alice.age);  // 30
```

---

### Arrow Functions and `this`

Arrow functions **do not** have their own `this`. They capture `this` from the enclosing lexical scope at the time they are defined — this is called **lexical `this`**.

```js
const timer = {
  seconds: 0,
  start() {
    // `this` inside the arrow function refers to `timer`
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};

timer.start(); // 1, 2, 3, ...
```

Compare with a regular function (broken):

```js
const timerBroken = {
  seconds: 0,
  start() {
    setInterval(function() {
      this.seconds++; // `this` is the global object (or undefined in strict mode)
      console.log(this.seconds); // NaN
    }, 1000);
  }
};
```

### Priority of `this` Binding Rules

From highest to lowest priority:

1. `new` binding
2. Explicit binding (`call`, `apply`, `bind`)
3. Implicit binding (method call)
4. Default binding

---

## 2. Prototypes, Prototypal Inheritance, Class Syntactic Sugar, and Polymorphism

### The Prototype Chain

Every JavaScript object has an internal link to another object called its **prototype**. When you access a property or method on an object, JavaScript first looks on the object itself, then climbs the **prototype chain** until it either finds the property or reaches `null`.

```
myObj → Object.prototype → null
```

```js
const animal = {
  breathe() {
    console.log('Breathing...');
  }
};

const dog = Object.create(animal); // dog's prototype is animal
dog.bark = function() {
  console.log('Woof!');
};

dog.bark();    // "Woof!" — found on dog itself
dog.breathe(); // "Breathing..." — found on animal (prototype)
```

You can inspect the prototype chain:

```js
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty('bark'));             // true
console.log(dog.hasOwnProperty('breathe'));          // false
```

---

### Constructor Functions and `prototype`

Before ES6 classes, prototypal inheritance was set up manually using constructor functions:

```js
function Animal(name) {
  this.name = name;
}

// Methods are placed on the prototype — shared across all instances
Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound.`);
};

function Dog(name, breed) {
  Animal.call(this, name); // call parent constructor
  this.breed = breed;
}

// Set up prototype chain: Dog.prototype → Animal.prototype
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // repair the constructor reference

Dog.prototype.bark = function() {
  console.log(`${this.name} barks!`);
};

const rex = new Dog('Rex', 'Labrador');
rex.speak(); // "Rex makes a sound."  (inherited from Animal.prototype)
rex.bark();  // "Rex barks!"          (on Dog.prototype)

console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true
```

**Why put methods on the prototype?**

If you define methods inside the constructor (`this.speak = function(){...}`), each instance gets its own copy of the function — wasteful. Prototype methods are shared across all instances.

---

### ES6 Classes — Syntactic Sugar

ES6 `class` syntax is a cleaner way to write the same prototype-based inheritance. Internally it works exactly the same way.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }

  // Static method — belongs to the class itself, not instances
  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);       // calls Animal's constructor
    this.breed = breed;
  }

  bark() {
    console.log(`${this.name} barks!`);
  }

  // Override parent method
  speak() {
    super.speak();     // calls Animal's speak
    console.log(`...and specifically barks.`);
  }
}

const rex = new Dog('Rex', 'Labrador');
rex.speak();
// "Rex makes a sound."
// "...and specifically barks."

const generic = Animal.create('Cat');
generic.speak(); // "Cat makes a sound."
```

**Key class features:**

| Feature | Syntax |
|---|---|
| Constructor | `constructor(...) {}` |
| Instance method | `methodName() {}` |
| Static method | `static methodName() {}` |
| Getter | `get propName() {}` |
| Setter | `set propName(value) {}` |
| Private field (ES2022) | `#fieldName` |
| Inheritance | `class Child extends Parent` |
| Parent constructor | `super(args)` |
| Parent method | `super.methodName()` |

---

### Private Fields and Methods (ES2022)

```js
class BankAccount {
  #balance = 0; // private field — cannot be accessed outside the class

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.balance); // 150
console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

---

### Polymorphism

Polymorphism means different objects respond to the same method name in different ways. In JavaScript, this is achieved through method overriding.

```js
class Shape {
  area() {
    return 0;
  }

  toString() {
    return `Shape with area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

const shapes = [new Circle(5), new Rectangle(4, 6)];

// Polymorphic behavior — same method, different results
shapes.forEach(shape => {
  console.log(shape.toString());
});
// "Shape with area 78.53981633974483"
// "Shape with area 24"
```

---

### `instanceof`, `Object.create`, and `Object.setPrototypeOf`

```js
// Object.create — create an object with a specific prototype
const proto = {
  greet() { console.log(`Hi, I'm ${this.name}`); }
};

const obj = Object.create(proto);
obj.name = 'Alice';
obj.greet(); // "Hi, I'm Alice"

// instanceof — checks the prototype chain
console.log(obj instanceof Object); // true

// Object.getPrototypeOf
console.log(Object.getPrototypeOf(obj) === proto); // true
```

---

## 3. Closures and Their Practical Applications

### What is a Closure?

A **closure** is a function that **remembers the variables from its lexical scope** even when the function is executed outside that scope. In JavaScript, every function creates a closure.

```js
function makeCounter() {
  let count = 0; // `count` is in makeCounter's scope

  return function() {
    count++;      // inner function "closes over" count
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// count is not accessible from outside
// console.log(count); // ReferenceError
```

The inner function maintains a reference to `count` in the **closure environment** — the snapshot of the outer function's scope at the time it was created.

---

### How Closures Work Internally

Every function in JavaScript has:
- An **environment record** — a mapping of variable names to values
- A reference to its **outer environment** — its lexical parent's scope

When a function executes, it looks up variables in its own environment first, then walks up the chain. The closure keeps the outer environment alive as long as the inner function exists.

```js
function outer() {
  const x = 10;

  function inner() {
    const y = 20;
    console.log(x + y); // x from closure, y from own scope
  }

  return inner;
}

const fn = outer(); // outer has returned, but x is still alive
fn(); // 30
```

---

### Practical Application 1: Data Privacy / Encapsulation

Closures are the classic way to create **private state** in JavaScript (before ES2022 private fields).

```js
function createPerson(name) {
  let _age = 0; // private

  return {
    getName() { return name; },
    getAge()  { return _age; },
    birthday() {
      _age++;
      console.log(`${name} is now ${_age}`);
    }
  };
}

const alice = createPerson('Alice');
alice.birthday(); // "Alice is now 1"
alice.birthday(); // "Alice is now 2"
console.log(alice.getAge()); // 2
// alice._age is undefined — not accessible
```

---

### Practical Application 2: Function Factories

Closures allow you to create **specialized functions** from a generic template.

```js
function multiplier(factor) {
  return (number) => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
console.log(double(7));  // 14
```

---

### Practical Application 3: Memoization

Cache the results of expensive function calls using closures.

```js
function memoize(fn) {
  const cache = new Map(); // cache lives in the closure

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveSquare = memoize((n) => {
  console.log('Computing...');
  return n * n;
});

expensiveSquare(5); // "Computing..." → 25
expensiveSquare(5); // "Cache hit"    → 25
expensiveSquare(6); // "Computing..." → 36
```

---

### Practical Application 4: Partial Application and Currying

```js
// Partial application: pre-fill some arguments
function add(a, b, c) {
  return a + b + c;
}

const addFive = add.bind(null, 5);
console.log(addFive(3, 2)); // 10

// Currying: transform f(a,b,c) into f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));   // 6
console.log(curriedAdd(1, 2)(3));   // 6
console.log(curriedAdd(1)(2, 3));   // 6
```

---

### Practical Application 5: Event Listeners and Callbacks

```js
function attachLogger(element, label) {
  // label is captured in the closure
  element.addEventListener('click', function() {
    console.log(`${label} was clicked`);
  });
}

const btn = document.querySelector('#myButton');
attachLogger(btn, 'My Button');
// Every click logs: "My Button was clicked"
```

---

### Common Closure Gotcha: Loops

A classic bug with closures in loops using `var`:

```js
// BUG: All callbacks log 3
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 — all share the same `i`
  }, 100);
}
```

**Fix 1: Use `let`** (block-scoped, creates a new binding per iteration)

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2
  }, 100);
}
```

**Fix 2: IIFE** (creates a new scope per iteration — classic pre-ES6 approach)

```js
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2
    }, 100);
  })(i);
}
```

---

## 4. Iterators, Generators, and Symbols

### The Iteration Protocol

JavaScript defines two protocols that enable custom iteration:

1. **The Iterable Protocol** — an object is *iterable* if it has a `[Symbol.iterator]()` method that returns an **iterator**
2. **The Iterator Protocol** — an object is an *iterator* if it has a `next()` method that returns `{ value, done }`

Built-in iterables: `Array`, `String`, `Map`, `Set`, `NodeList`, `arguments`, generator objects.

```js
// Any of these work on iterables:
for (const item of iterable) { ... }
const arr = [...iterable];
const [a, b] = iterable;
Array.from(iterable);
```

---

### Custom Iterators

```js
// A range iterator: iterates from `start` to `end`
function createRange(start, end) {
  return {
    [Symbol.iterator]() {      // makes it iterable
      let current = start;
      return {
        next() {               // the iterator
          if (current <= end) {
            return { value: current++, done: false };
          }
          return { value: undefined, done: true };
        }
      };
    }
  };
}

const range = createRange(1, 5);

for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}

console.log([...createRange(1, 3)]); // [1, 2, 3]
```

---

### Generators

A **generator function** (`function*`) is a special function that can **pause and resume** its execution using `yield`. Each call to `next()` runs until the next `yield`, then pauses.

```js
function* simpleGenerator() {
  console.log('Start');
  yield 1;
  console.log('After first yield');
  yield 2;
  console.log('After second yield');
  yield 3;
  console.log('Done');
}

const gen = simpleGenerator();

console.log(gen.next()); // "Start"           → { value: 1, done: false }
console.log(gen.next()); // "After first yield" → { value: 2, done: false }
console.log(gen.next()); // "After second yield" → { value: 3, done: false }
console.log(gen.next()); // "Done"            → { value: undefined, done: true }
```

Generators automatically implement the iterator protocol — they are both iterable and iterators:

```js
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

for (const n of range(0, 10, 2)) {
  console.log(n); // 0, 2, 4, 6, 8, 10
}

console.log([...range(1, 5)]); // [1, 2, 3, 4, 5]
```

---

### Passing Values into Generators

`next(value)` can pass a value back into the generator — the `yield` expression evaluates to that value.

```js
function* calculator() {
  const a = yield 'Enter first number:';
  const b = yield 'Enter second number:';
  return a + b;
}

const calc = calculator();
console.log(calc.next().value);    // "Enter first number:"
console.log(calc.next(10).value);  // "Enter second number:" (a = 10)
console.log(calc.next(5).value);   // 15 (b = 5, returns 10 + 5)
```

---

### Generator Use Case: Infinite Sequences

```js
function* naturals() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

function take(n, iterable) {
  const result = [];
  for (const val of iterable) {
    result.push(val);
    if (result.length >= n) break;
  }
  return result;
}

console.log(take(5, naturals())); // [1, 2, 3, 4, 5]
```

---

### Generator Use Case: Async Control Flow

Before `async/await` became standard, generators (with a runner) were used for async code:

```js
function* fetchUser(userId) {
  const user    = yield fetch(`/api/users/${userId}`).then(r => r.json());
  const posts   = yield fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
  return { user, posts };
}
// (Runner not shown — this pattern was superseded by async/await)
```

---

### `yield*` — Delegating to Another Iterable

```js
function* inner() {
  yield 'a';
  yield 'b';
}

function* outer() {
  yield 1;
  yield* inner();  // delegates to inner generator
  yield* [10, 20]; // delegates to array
  yield 2;
}

console.log([...outer()]); // [1, 'a', 'b', 10, 20, 2]
```

---

### Symbols

**Symbols** are a **primitive type** (like `number`, `string`, `boolean`) introduced in ES6. Every Symbol is **unique and immutable** — no two symbols are ever equal, even if created with the same description.

```js
const sym1 = Symbol('id');
const sym2 = Symbol('id');
console.log(sym1 === sym2); // false — always unique

typeof sym1; // "symbol"
sym1.toString(); // "Symbol(id)"
sym1.description; // "id"
```

**Use Case 1: Unique Object Keys**

Symbols as property keys are hidden from `for...in`, `Object.keys()`, and `JSON.stringify()` — useful for "semi-private" properties.

```js
const ID = Symbol('id');

const user = {
  name: 'Alice',
  [ID]: 12345 // symbol key — hidden from enumeration
};

console.log(user[ID]);          // 12345
console.log(Object.keys(user)); // ['name'] — ID is not listed
console.log(JSON.stringify(user)); // '{"name":"Alice"}' — ID is omitted

// Symbols are visible via:
Object.getOwnPropertySymbols(user); // [Symbol(id)]
Reflect.ownKeys(user);              // ['name', Symbol(id)]
```

**Use Case 2: Avoiding Name Collisions in Libraries**

```js
// Library A
const A_METADATA = Symbol('metadata');

// Library B
const B_METADATA = Symbol('metadata');

const obj = {};
obj[A_METADATA] = { source: 'A' };
obj[B_METADATA] = { source: 'B' };

// No collision — both live independently
console.log(obj[A_METADATA]); // { source: 'A' }
console.log(obj[B_METADATA]); // { source: 'B' }
```

---

### Well-Known Symbols

JavaScript uses built-in symbols (called **well-known symbols**) to let you hook into core language behaviors. These are properties on `Symbol`:

| Symbol | Purpose |
|---|---|
| `Symbol.iterator` | Defines the default iterator for an object |
| `Symbol.toPrimitive` | Controls type coercion |
| `Symbol.hasInstance` | Controls `instanceof` behavior |
| `Symbol.toStringTag` | Customizes `Object.prototype.toString` output |
| `Symbol.species` | Specifies the constructor for derived objects |

**`Symbol.iterator` — custom iteration:**

```js
class Fibonacci {
  constructor(limit) {
    this.limit = limit;
  }

  [Symbol.iterator]() {
    let a = 0, b = 1, count = 0;
    const limit = this.limit;

    return {
      next() {
        if (count++ >= limit) return { value: undefined, done: true };
        const value = a;
        [a, b] = [b, a + b];
        return { value, done: false };
      }
    };
  }
}

console.log([...new Fibonacci(8)]); // [0, 1, 1, 2, 3, 5, 8, 13]
```

**`Symbol.toPrimitive` — custom type coercion:**

```js
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.celsius;
    if (hint === 'string') return `${this.celsius}°C`;
    return this.celsius; // default
  }
}

const temp = new Temperature(100);
console.log(+temp);           // 100       (number hint)
console.log(`${temp}`);       // "100°C"   (string hint)
console.log(temp + 0);        // 100       (default hint)
```

**`Symbol.toStringTag` — custom class name in `toString`:**

```js
class MyCollection {
  get [Symbol.toStringTag]() {
    return 'MyCollection';
  }
}

const col = new MyCollection();
console.log(Object.prototype.toString.call(col)); // "[object MyCollection]"
```

---

### Global Symbol Registry

`Symbol.for(key)` creates (or reuses) a symbol in a **global registry**, shared across modules and iframes.

```js
const sym1 = Symbol.for('shared');
const sym2 = Symbol.for('shared');
console.log(sym1 === sym2); // true — same symbol from registry

Symbol.keyFor(sym1); // "shared"
Symbol.keyFor(Symbol('local')); // undefined — not in registry
```

---

## Summary

| Concept | Key Takeaway |
|---|---|
| `this` | Determined by *how* a function is called, not *where* it's defined |
| `call` / `apply` | Invoke a function with explicit `this` immediately |
| `bind` | Return a new function with `this` permanently bound |
| Arrow functions | Lexically inherit `this` from surrounding scope |
| Prototype chain | Objects delegate property lookups up the prototype chain |
| Constructor functions | Pattern for creating objects with shared methods on `.prototype` |
| ES6 `class` | Syntactic sugar over prototype-based inheritance |
| Polymorphism | Different classes implement the same interface differently |
| Closure | A function that retains access to its defining scope's variables |
| Iterator protocol | `next()` returning `{ value, done }` |
| Iterable protocol | Having `[Symbol.iterator]()` returning an iterator |
| Generator | `function*` that pauses at `yield` and resumes on `next()` |
| Symbol | A unique, immutable primitive — used for unique keys and meta-programming |
| Well-known Symbols | Built-in hooks to customize language behavior |

---

## Further Reading

- [MDN — `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN — Function.prototype.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN — Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [MDN — Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [MDN — Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN — function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
- [MDN — Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [You Don't Know JS: `this` & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/README.md)
