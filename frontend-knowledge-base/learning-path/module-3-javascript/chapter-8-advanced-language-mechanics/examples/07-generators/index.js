// ============================================================
// Example 7: Generators — Pausable Functions with `function*`
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// PART 1: Basic Generator Mechanics
// A generator function returns a generator object.
// Each call to next() resumes execution until the next `yield`.
// ----------------------------------------------------------

function* alphabet() {
  yield 'A';
  yield 'B';
  yield 'C';
  // implicit return undefined, done: true
}

const gen = alphabet();
console.log(gen.next()); // { value: 'A', done: false }
console.log(gen.next()); // { value: 'B', done: false }
console.log(gen.next()); // { value: 'C', done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Generators are iterable — use with for...of, spread, etc.
console.log([...alphabet()]); // ['A', 'B', 'C']

// ----------------------------------------------------------
// PART 2: Infinite Generators — Lazy Sequences
// Generators compute values one at a time, on demand.
// ----------------------------------------------------------

function* naturals(start = 1) {
  let n = start;
  while (true) {       // infinite loop is safe — pauses at each yield
    yield n++;
  }
}

function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function take(n, gen) {
  const result = [];
  for (const val of gen) {
    result.push(val);
    if (result.length >= n) break;
  }
  return result;
}

console.log(take(8, fibonacci()));  // [0, 1, 1, 2, 3, 5, 8, 13]
console.log(take(5, naturals(10))); // [10, 11, 12, 13, 14]

// ----------------------------------------------------------
// PART 3: Passing Values INTO a Generator via next(value)
// The value passed to next() becomes the result of the `yield` expression.
// ----------------------------------------------------------

function* accumulator() {
  let total = 0;
  while (true) {
    const input = yield total; // yield current total, receive next number
    if (input === null) break; // sentinel to stop
    total += input;
  }
  return total;
}

const acc = accumulator();
acc.next();          // Start (first next() can't pass a meaningful value)
console.log(acc.next(5).value);   // 5   (total after adding 5)
console.log(acc.next(10).value);  // 15  (total after adding 10)
console.log(acc.next(3).value);   // 18  (total after adding 3)
console.log(acc.next(null));      // { value: 18, done: true }

// ----------------------------------------------------------
// PART 4: yield* — Delegating to Another Iterable
// ----------------------------------------------------------

function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item); // recursively delegate
    } else {
      yield item;
    }
  }
}

const nested = [1, [2, 3], [4, [5, 6]], 7];
console.log([...flatten(nested)]); // [1, 2, 3, 4, 5, 6, 7]

function* concat(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

console.log([...concat([1, 2], 'AB', new Set([3, 4]))]); // [1, 2, 'A', 'B', 3, 4]

// ----------------------------------------------------------
// PART 5: Generator Return and Throw
// ----------------------------------------------------------

function* controlled() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } catch (err) {
    console.log('Error caught in generator:', err.message);
    yield -1; // can still yield after catching
  } finally {
    console.log('Generator cleanup (finally)');
  }
}

const g = controlled();
console.log(g.next());            // { value: 1, done: false }
console.log(g.throw(new Error('Oops!'))); // logs "Error caught...", { value: -1, done: false }
console.log(g.next());            // logs "Generator cleanup...", { value: undefined, done: true }

// g.return(value) — force the generator to finish with a given value
const g2 = controlled();
g2.next();                        // start
console.log(g2.return(42));       // { value: 42, done: true } — skips remaining yields

// ----------------------------------------------------------
// PART 6: Practical — Unique ID Generator
// ----------------------------------------------------------

function* idGenerator(prefix = 'id') {
  let seq = 1;
  while (true) {
    yield `${prefix}-${String(seq++).padStart(4, '0')}`;
  }
}

const userId  = idGenerator('usr');
const orderId = idGenerator('ord');

console.log(userId.next().value);  // "usr-0001"
console.log(userId.next().value);  // "usr-0002"
console.log(orderId.next().value); // "ord-0001"
console.log(userId.next().value);  // "usr-0003"

// ----------------------------------------------------------
// PART 7: Practical — Paginated API Fetcher (simulated)
// Generators are excellent for fetching paginated data lazily.
// ----------------------------------------------------------

function simulateFetch(page) {
  // Simulates an API that returns 3 items per page, up to page 3
  if (page > 3) return Promise.resolve({ data: [], hasMore: false });
  return Promise.resolve({
    data: Array.from({ length: 3 }, (_, i) => ({ id: (page - 1) * 3 + i + 1 })),
    hasMore: page < 3
  });
}

async function* paginatedFetcher(fetchPage) {
  let page = 1;
  while (true) {
    const response = await fetchPage(page++);
    yield* response.data;           // yield each item
    if (!response.hasMore) break;
  }
}

(async () => {
  const items = [];
  for await (const item of paginatedFetcher(simulateFetch)) {
    items.push(item);
  }
  console.log('All paginated items:', items);
  // [{ id:1 }, { id:2 }, ..., { id:9 }]
})();
