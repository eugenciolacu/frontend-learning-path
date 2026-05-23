/* ─────────────────────────────────────────────────────────────────────────
 *  test-runner.js
 *  Minimal async test framework + 25 test cases for MyPromise.
 *
 *  Chapter 2  – Arrow functions, for...of loop, default parameters, try/catch
 *  Chapter 3  – Array.push, Array.reduce, Object.entries, destructuring
 *  Chapter 4  – createElement, appendChild, textContent, className
 *  Chapter 5  – async/await, try/catch, native Promise (delay helper only)
 *  Chapter 8  – Closures: _tests array captured by test() and runAllTests()
 * ─────────────────────────────────────────────────────────────────────────
 */

import { MyPromise } from './my-promise.js';

// ── Mini test framework ────────────────────────────────────────────────────

// Chapter 8: closure — _tests is private to this module
const _tests = []; // Chapter 3: array holding all registered test objects

/**
 * Register a named async test.
 * Chapter 2: default parameter suite = 'General'
 * Chapter 8: fn closes over its assertions
 */
function test(name, fn, suite = 'General') {
  _tests.push({ name, fn, suite });
}

// Simple assertion helpers (Chapter 2: arrow functions, early return)
function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertEqual(actual, expected, label = '') {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    throw new Error(`${label ? label + ': ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

/** Native delay — uses native Promise to avoid circular dependency */
const delay = ms => new Promise(r => setTimeout(r, ms));

// ── Test Suite 1: State Machine ───────────────────────────────────────────

test('Executor runs synchronously', async () => {
  let ran = false;
  new MyPromise(() => { ran = true; });
  assert(ran, 'executor should run synchronously inside the constructor');
}, 'State Machine');

test('Transitions to FULFILLED on resolve', async () => {
  const val = await MyPromise.resolve(42);
  assertEqual(val, 42, 'fulfilled value');
}, 'State Machine');

test('Transitions to REJECTED on reject', async () => {
  let caught;
  await MyPromise.reject(new Error('oops')).catch(e => { caught = e.message; });
  assertEqual(caught, 'oops', 'rejection reason');
}, 'State Machine');

test('Executor throw → promise rejected', async () => {
  let msg;
  await new MyPromise(() => { throw new Error('sync throw'); })
    .catch(e => { msg = e.message; });
  assertEqual(msg, 'sync throw', 'executor throw propagated');
}, 'State Machine');

test('Second resolve() after first is ignored', async () => {
  const val = await new MyPromise(resolve => { resolve(1); resolve(2); });
  assertEqual(val, 1, 'only first resolve counts');
}, 'State Machine');

// ── Test Suite 2: Chaining ────────────────────────────────────────────────

test('.then() receives fulfilled value', async () => {
  const val = await MyPromise.resolve(10).then(v => v * 2);
  assertEqual(val, 20, 'then transform');
}, 'Chaining');

test('.then() chained three times', async () => {
  const val = await MyPromise.resolve(1)
    .then(v => v + 1)
    .then(v => v + 1)
    .then(v => v + 1);
  assertEqual(val, 4, 'three-step chain');
}, 'Chaining');

test('.then() with async callback — chain flattened', async () => {
  const val = await MyPromise.resolve(5).then(v =>
    new MyPromise(resolve => setTimeout(() => resolve(v * 2), 30)),
  );
  assertEqual(val, 10, 'async then flattening');
}, 'Chaining');

test('.catch() handles rejection', async () => {
  const val = await MyPromise.reject(new Error('bad'))
    .catch(e => `caught: ${e.message}`);
  assertEqual(val, 'caught: bad', 'catch handler');
}, 'Chaining');

test('.catch() recovery — chain continues after handler', async () => {
  const val = await MyPromise.reject('err')
    .catch(() => 42)
    .then(v => v + 1);
  assertEqual(val, 43, 'recovery and continuation');
}, 'Chaining');

test('.finally() runs on fulfillment, passes value through', async () => {
  let called = false;
  const val = await MyPromise.resolve(99)
    .finally(() => { called = true; });
  assert(called, 'finally was called');
  assertEqual(val, 99, 'value passed through finally');
}, 'Chaining');

test('.finally() runs on rejection, passes reason through', async () => {
  let called = false;
  let reason;
  await MyPromise.reject(new Error('boom'))
    .finally(() => { called = true; })
    .catch(e => { reason = e.message; });
  assert(called, 'finally called on rejection');
  assertEqual(reason, 'boom', 'rejection reason preserved');
}, 'Chaining');

// ── Test Suite 3: Microtask Ordering ─────────────────────────────────────

test('.then() callback is always async, even for resolved promises', async () => {
  const order = [];
  MyPromise.resolve().then(() => order.push('microtask'));
  order.push('sync');
  await delay(10);
  assertEqual(order, ['sync', 'microtask'], 'microtask fires after sync code');
}, 'Microtask');

test('Already-resolved .then() is still scheduled asynchronously', async () => {
  const order = [];
  MyPromise.resolve('x').then(() => order.push('b'));
  order.push('a');
  await delay(10);
  assertEqual(order, ['a', 'b'], 'async even when already settled');
}, 'Microtask');

// ── Test Suite 4: Static Combinators ─────────────────────────────────────

test('MyPromise.all resolves when all fulfill', async () => {
  const results = await MyPromise.all([
    MyPromise.resolve(1),
    MyPromise.resolve(2),
    MyPromise.resolve(3),
  ]);
  assertEqual(results, [1, 2, 3], 'all results');
}, 'Combinators');

test('MyPromise.all preserves insertion order', async () => {
  const results = await MyPromise.all([
    new MyPromise(r => setTimeout(() => r('slow'), 40)),
    MyPromise.resolve('fast'),
  ]);
  assertEqual(results, ['slow', 'fast'], 'order preserved despite timing');
}, 'Combinators');

test('MyPromise.all rejects on first rejection', async () => {
  let msg;
  await MyPromise.all([
    MyPromise.resolve(1),
    MyPromise.reject(new Error('fail')),
    MyPromise.resolve(3),
  ]).catch(e => { msg = e.message; });
  assertEqual(msg, 'fail', 'first rejection wins');
}, 'Combinators');

test('MyPromise.all with empty array resolves immediately', async () => {
  const results = await MyPromise.all([]);
  assertEqual(results, [], 'empty array');
}, 'Combinators');

test('MyPromise.race resolves with fastest fulfillment', async () => {
  const result = await MyPromise.race([
    new MyPromise(r => setTimeout(() => r('slow'), 80)),
    new MyPromise(r => setTimeout(() => r('fast'), 20)),
  ]);
  assertEqual(result, 'fast', 'race winner');
}, 'Combinators');

test('MyPromise.allSettled never rejects', async () => {
  const results = await MyPromise.allSettled([
    MyPromise.resolve('ok'),
    MyPromise.reject(new Error('bad')),
  ]);
  assertEqual(results[0].status, 'fulfilled', 'first is fulfilled');
  assertEqual(results[1].status, 'rejected',  'second is rejected');
}, 'Combinators');

test('MyPromise.any resolves with first fulfillment', async () => {
  const result = await MyPromise.any([
    MyPromise.reject(new Error('a')),
    MyPromise.resolve('winner'),
    MyPromise.resolve('also-ok'),
  ]);
  assertEqual(result, 'winner', 'first fulfilled value');
}, 'Combinators');

test('MyPromise.any rejects with AggregateError if all reject', async () => {
  let err;
  await MyPromise.any([
    MyPromise.reject(new Error('a')),
    MyPromise.reject(new Error('b')),
  ]).catch(e => { err = e; });
  assert(err instanceof AggregateError, 'AggregateError thrown');
}, 'Combinators');

// ── Test Suite 5: Thenable Interop ───────────────────────────────────────

test('Resolving with a thenable adopts its state', async () => {
  const thenable = { then: res => res(42) };
  const val = await new MyPromise(resolve => resolve(thenable));
  assertEqual(val, 42, 'thenable value adopted');
}, 'Thenable');

test('MyPromise interoperates with native async/await', async () => {
  const val = await MyPromise.resolve(99);
  assertEqual(val, 99, 'native await on MyPromise');
}, 'Thenable');

test('MyPromise.withResolvers returns usable promise/resolve/reject', async () => {
  const { promise, resolve } = MyPromise.withResolvers();
  setTimeout(() => resolve('deferred'), 20);
  const val = await promise;
  assertEqual(val, 'deferred', 'withResolvers pattern');
}, 'Thenable');

// ── Runner ────────────────────────────────────────────────────────────────

/**
 * Run all registered tests and render results to the DOM.
 *
 * Chapter 2: for...of loop, try/catch per test
 * Chapter 3: Array.reduce to group by suite, Object.entries to iterate
 * Chapter 4: createElement, appendChild, textContent
 * Chapter 5: async/await, await each test fn
 */
async function runAllTests(containerEl) {
  containerEl.innerHTML = ''; // Chapter 4: clear previous results

  // Chapter 3: group tests by suite using reduce()
  const suites = _tests.reduce((acc, t) => {
    acc[t.suite] = acc[t.suite] ?? [];
    acc[t.suite].push(t);
    return acc;
  }, {});

  let totalPass = 0;
  let totalFail = 0;

  // Chapter 2: for...of over Object.entries() — [suiteName, testsArray] pairs
  for (const [suiteName, suiteTests] of Object.entries(suites)) {
    const suiteEl = document.createElement('div');
    suiteEl.className = 'test-suite';

    const suiteHeader = document.createElement('h3');
    suiteHeader.className = 'suite-name';
    suiteHeader.textContent = suiteName;
    suiteEl.appendChild(suiteHeader);

    // Chapter 2: for...of loop — run tests sequentially with await
    for (const t of suiteTests) {
      let status = 'pass';
      let errorMsg = '';

      // Chapter 5: async try/catch — await each test function
      try {
        await t.fn();
      } catch (err) {
        status   = 'fail';
        errorMsg = err.message;
        totalFail++;
      }

      if (status === 'pass') totalPass++;

      // Chapter 4: DOM element creation for each test row
      const testEl = document.createElement('div');
      testEl.className = `test-row test-${status}`;

      const iconEl = document.createElement('span');
      iconEl.className = 'test-icon';
      iconEl.textContent = status === 'pass' ? '✓' : '✗';

      const nameEl = document.createElement('span');
      nameEl.className = 'test-name';
      nameEl.textContent = t.name;

      testEl.appendChild(iconEl);
      testEl.appendChild(nameEl);

      if (errorMsg) {
        const errEl = document.createElement('span');
        errEl.className = 'test-error';
        errEl.textContent = errorMsg;
        testEl.appendChild(errEl);
      }

      suiteEl.appendChild(testEl);
    }

    containerEl.appendChild(suiteEl);
  }

  // Summary banner — prepended above the suite list
  const summaryEl = document.createElement('div');
  const allPass   = totalFail === 0;
  summaryEl.className = `test-summary ${allPass ? 'all-pass' : 'has-failures'}`;
  // Chapter 1: template literals
  summaryEl.textContent = `${totalPass} passed  /  ${totalFail} failed  /  ${_tests.length} total`;
  containerEl.prepend(summaryEl);
}

export { runAllTests };
