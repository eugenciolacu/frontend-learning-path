// ============================================================
// Example 8: Symbols — Unique Keys and Language Meta-programming
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// PART 1: Symbol Basics — Uniqueness Guarantee
// ----------------------------------------------------------

const sym1 = Symbol('id');
const sym2 = Symbol('id');

console.log(sym1 === sym2);      // false — always unique, even same description
console.log(typeof sym1);        // "symbol"
console.log(sym1.toString());    // "Symbol(id)"
console.log(sym1.description);   // "id"

// Symbols cannot be coerced to strings implicitly
try {
  const s = `${sym1}`; // throws TypeError
} catch (e) {
  console.log('Template literal throws:', e.message);
}

// Explicit conversion is fine:
console.log(sym1.toString()); // "Symbol(id)"
console.log(String(sym1));    // "Symbol(id)"

// ----------------------------------------------------------
// PART 2: Symbols as Object Keys — Semi-Private Properties
// Symbol-keyed properties are hidden from most enumeration APIs.
// ----------------------------------------------------------

const _type   = Symbol('type');
const _secret = Symbol('secret');

const config = {
  host: 'localhost',
  port: 3000,
  [_type]: 'development',    // symbol key
  [_secret]: 'abc123'        // symbol key
};

// Regular enumeration does NOT include symbols:
console.log(Object.keys(config));                  // ['host', 'port']
console.log(Object.values(config));                // ['localhost', 3000]
console.log(JSON.stringify(config));               // '{"host":"localhost","port":3000}'
for (const key in config) console.log(key);        // host, port (no symbols)

// But symbols ARE accessible if you have the key:
console.log(config[_type]);    // "development"
console.log(config[_secret]);  // "abc123"

// And discoverable via:
console.log(Object.getOwnPropertySymbols(config)); // [Symbol(type), Symbol(secret)]
console.log(Reflect.ownKeys(config));              // ['host', 'port', Symbol(type), Symbol(secret)]

// ----------------------------------------------------------
// PART 3: Avoiding Name Collisions in Shared Objects
// Symbols are the safe way to add metadata to objects you don't own.
// ----------------------------------------------------------

// Imagine a logging library that needs to attach metadata to any user object
const LOG_LEVEL   = Symbol('logLevel');
const LOG_ENABLED = Symbol('logEnabled');

function attachLogging(obj, level = 'info') {
  obj[LOG_LEVEL]   = level;
  obj[LOG_ENABLED] = true;
  return obj;
}

function log(obj, message) {
  if (obj[LOG_ENABLED]) {
    console.log(`[${obj[LOG_LEVEL].toUpperCase()}] ${message}`);
  }
}

const server = attachLogging({ host: 'localhost', port: 8080 }, 'debug');
log(server, 'Server started'); // "[DEBUG] Server started"

// The user's object is unaffected — no string key pollution:
console.log(Object.keys(server)); // ['host', 'port']

// ----------------------------------------------------------
// PART 4: Global Symbol Registry — Symbol.for()
// Use when you need the same symbol across different modules/files.
// ----------------------------------------------------------

const tokenA = Symbol.for('auth:token');
const tokenB = Symbol.for('auth:token');
console.log(tokenA === tokenB); // true — same symbol from the global registry

Symbol.keyFor(tokenA);          // "auth:token"
Symbol.keyFor(Symbol('local')); // undefined — local symbol, not in registry

// ----------------------------------------------------------
// PART 5: Well-Known Symbol — Symbol.iterator
// Implement the iterable protocol on a custom class.
// ----------------------------------------------------------

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

const fib = new Fibonacci(8);
console.log([...fib]);               // [0, 1, 1, 2, 3, 5, 8, 13]
console.log(Array.from(fib).reduce((a, b) => a + b, 0)); // sum = 33

// ----------------------------------------------------------
// PART 6: Well-Known Symbol — Symbol.toPrimitive
// Control how your object is coerced to a primitive.
// ----------------------------------------------------------

class Money {
  constructor(amount, currency = 'USD') {
    this.amount   = amount;
    this.currency = currency;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.currency} ${this.amount.toFixed(2)}`;
    return this.amount; // default
  }

  add(other) {
    return new Money(this.amount + +other, this.currency);
  }
}

const price    = new Money(19.99);
const tax      = new Money(2.00);
const shipping = new Money(5.00);

console.log(`Price: ${price}`);           // "Price: USD 19.99" (string hint)
console.log(+price);                       // 19.99             (number hint)
console.log(price + tax + shipping);       // 26.99             (default/number hint)

// ----------------------------------------------------------
// PART 7: Well-Known Symbol — Symbol.hasInstance
// Control what `instanceof` returns for your class.
// ----------------------------------------------------------

class TypeChecker {
  static [Symbol.hasInstance](instance) {
    // Consider any plain object as an instance
    return typeof instance === 'object' && instance !== null && !Array.isArray(instance);
  }
}

console.log({} instanceof TypeChecker);       // true
console.log([] instanceof TypeChecker);       // false
console.log(null instanceof TypeChecker);     // false
console.log('hello' instanceof TypeChecker);  // false

// ----------------------------------------------------------
// PART 8: Well-Known Symbol — Symbol.toStringTag
// Customize the output of Object.prototype.toString.call(obj).
// ----------------------------------------------------------

class Queue {
  #items = [];
  enqueue(item) { this.#items.push(item); }
  dequeue()     { return this.#items.shift(); }
  get size()    { return this.#items.length; }

  get [Symbol.toStringTag]() { return 'Queue'; }
}

const q = new Queue();
q.enqueue(1); q.enqueue(2);

console.log(Object.prototype.toString.call(q)); // "[object Queue]"
console.log(q.toString());                      // "[object Queue]"
