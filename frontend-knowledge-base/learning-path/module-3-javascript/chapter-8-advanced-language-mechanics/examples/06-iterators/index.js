// ============================================================
// Example 6: Iterators — The Iteration Protocol
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// PART 1: Understanding the Built-in Iterator Protocol
// Every iterable has a [Symbol.iterator] method that returns an iterator.
// An iterator has a next() method returning { value, done }.
// ----------------------------------------------------------

const arr = [10, 20, 30];

// Get the iterator manually
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 10, done: false }
console.log(iterator.next()); // { value: 20, done: false }
console.log(iterator.next()); // { value: 30, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// `for...of` does this automatically
for (const n of arr) {
  process.stdout.write(`${n} `);
}
console.log(); // newline

// ----------------------------------------------------------
// PART 2: Building a Custom Iterator
// We implement the iterator protocol from scratch.
// ----------------------------------------------------------

/**
 * Creates an inclusive range iterator: [start, end, step]
 * Supports for...of, spread, destructuring, Array.from
 */
function range(start, end, step = 1) {
  return {
    // Makes the object iterable
    [Symbol.iterator]() {
      let current = start;

      // Returns the iterator object
      return {
        next() {
          if (current <= end) {
            const value = current;
            current += step;
            return { value, done: false };
          }
          return { value: undefined, done: true };
        },
        // Optional: make the iterator itself iterable
        [Symbol.iterator]() { return this; }
      };
    }
  };
}

// for...of
for (const n of range(1, 5)) {
  process.stdout.write(`${n} `);
}
console.log(); // 1 2 3 4 5

// Spread
console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8, 10]

// Destructuring
const [first, second, ...rest] = range(1, 6);
console.log(first, second, rest); // 1 2 [3, 4, 5, 6]

// Array.from with map callback
const squares = Array.from(range(1, 5), n => n ** 2);
console.log(squares); // [1, 4, 9, 16, 25]

// ----------------------------------------------------------
// PART 3: Linked List with Custom Iterator
// A practical example — iterating a data structure.
// ----------------------------------------------------------

class LinkedListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next  = next;
  }
}

class LinkedList {
  constructor(...values) {
    this.head = null;
    for (const v of values.reverse()) {
      this.head = new LinkedListNode(v, this.head);
    }
  }

  [Symbol.iterator]() {
    let current = this.head;
    return {
      next() {
        if (current === null) return { value: undefined, done: true };
        const value = current.value;
        current = current.next;
        return { value, done: false };
      }
    };
  }
}

const list = new LinkedList(1, 2, 3, 4, 5);
console.log([...list]);       // [1, 2, 3, 4, 5]
console.log(Math.max(...list)); // 5

for (const val of list) {
  process.stdout.write(`${val} `);
}
console.log(); // 1 2 3 4 5

// ----------------------------------------------------------
// PART 4: Infinite Iterator with early break
// Iterators are lazy — they only compute the next value on demand.
// ----------------------------------------------------------

function naturals(from = 1) {
  return {
    [Symbol.iterator]() {
      let n = from;
      return {
        next() { return { value: n++, done: false }; }
      };
    }
  };
}

// Take first N items from any iterable
function take(n, iterable) {
  const result = [];
  for (const val of iterable) {
    result.push(val);
    if (result.length >= n) break; // break signals done to the iterator
  }
  return result;
}

console.log(take(5, naturals()));       // [1, 2, 3, 4, 5]
console.log(take(5, naturals(100)));    // [100, 101, 102, 103, 104]

// ----------------------------------------------------------
// PART 5: Composing Iterators — map, filter, take as lazy wrappers
// ----------------------------------------------------------

function* lazyMap(iterable, fn) {
  for (const val of iterable) yield fn(val);
}

function* lazyFilter(iterable, predicate) {
  for (const val of iterable) {
    if (predicate(val)) yield val;
  }
}

// Compute first 5 even squares lazily — no large array created
const pipeline = lazyFilter(
  lazyMap(naturals(), n => n * n),  // squares: 1, 4, 9, 16, ...
  n => n % 2 === 0                  // only even squares: 4, 16, 36, ...
);

console.log(take(5, pipeline)); // [4, 16, 36, 64, 100]
