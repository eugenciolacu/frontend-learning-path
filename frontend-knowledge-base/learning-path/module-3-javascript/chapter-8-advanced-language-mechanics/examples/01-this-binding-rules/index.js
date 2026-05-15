// ============================================================
// Example 1: The Four Rules of `this` Binding
// ============================================================
// Run this file in Node.js: node index.js
// Or open index.html in a browser and check the console.

'use strict';

// ----------------------------------------------------------
// RULE 1: Default Binding
// In strict mode, `this` is undefined when called as a plain function.
// Without strict mode (browser, non-module), `this` is the global object.
// ----------------------------------------------------------

function showDefault() {
  // In strict mode: `this` is undefined
  // In sloppy mode (browser): `this` is `window`
  console.log('Default binding — this:', typeof this === 'undefined' ? 'undefined (strict mode)' : this);
}

showDefault();

// ----------------------------------------------------------
// RULE 2: Implicit Binding
// When called as a method of an object, `this` is the object.
// ----------------------------------------------------------

const user = {
  name: 'Alice',
  greet() {
    console.log('Implicit binding — this.name:', this.name);
  }
};

user.greet(); // "Alice"

// Implicit binding LOSS — common bug:
const greetFn = user.greet;
try {
  greetFn(); // In strict mode: TypeError (this is undefined, no .name)
} catch (e) {
  console.log('Implicit binding loss caught:', e.message);
}

// ----------------------------------------------------------
// RULE 3: Explicit Binding — call, apply, bind
// ----------------------------------------------------------

function introduce(greeting, punctuation) {
  console.log(`${greeting}, I am ${this.name}${punctuation}`);
}

const person = { name: 'Bob' };

// call — immediate invocation, individual args
introduce.call(person, 'Hello', '!');   // "Hello, I am Bob!"

// apply — immediate invocation, args as array
introduce.apply(person, ['Hi', '?']);   // "Hi, I am Bob?"

// bind — returns a new bound function
const introduceBob = introduce.bind(person, 'Hey');
introduceBob('!!!'); // "Hey, I am Bob!!!"

// Practical: bind to fix method extraction
const counter = {
  count: 0,
  increment() {
    this.count++;
    return this.count;
  }
};

const incrementFn = counter.increment.bind(counter);
console.log(incrementFn()); // 1
console.log(incrementFn()); // 2

// ----------------------------------------------------------
// RULE 4: new Binding
// When called with `new`, `this` is the newly created object.
// ----------------------------------------------------------

function Person(name, age) {
  this.name = name;
  this.age = age;
}

const alice = new Person('Alice', 30);
console.log('new binding — alice:', alice.name, alice.age); // "Alice" 30

// ----------------------------------------------------------
// ARROW FUNCTIONS: Lexical `this`
// Arrow functions do not have their own `this`.
// They capture `this` from the surrounding scope at definition time.
// ----------------------------------------------------------

const timerDemo = {
  label: 'Timer',
  ticks: 0,
  startRegular() {
    // ❌ Regular function — `this` is NOT timerDemo inside the callback
    const id = setInterval(function() {
      // `this` is undefined (strict mode) or global
      clearInterval(id);
    }, 50);
  },
  startArrow() {
    // ✅ Arrow function — `this` IS timerDemo
    let count = 0;
    const id = setInterval(() => {
      this.ticks++;
      count++;
      if (count >= 3) {
        console.log(`Arrow `this` — ticks: ${this.ticks}`); // 3
        clearInterval(id);
      }
    }, 50);
  }
};

timerDemo.startArrow();

// ----------------------------------------------------------
// PRIORITY: new > explicit > implicit > default
// ----------------------------------------------------------
function Foo() {
  this.value = 42;
}

const boundFoo = Foo.bind({ value: 100 }); // explicit bind
const obj = new boundFoo();                // new wins over bind

console.log('new beats bind — obj.value:', obj.value); // 42, NOT 100
