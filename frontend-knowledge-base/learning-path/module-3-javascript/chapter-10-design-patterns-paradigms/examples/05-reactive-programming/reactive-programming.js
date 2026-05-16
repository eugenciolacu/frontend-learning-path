// ============================================================
// REACTIVE PROGRAMMING — Mini Observable Library
// ============================================================
// This file implements core reactive primitives from scratch:
//  - Observable: a stream of values over time
//  - Operators: map, filter, take, scan, debounceTime, distinctUntilChanged
//  - Subject: observable that is also an observer (multicast)
//
// This is how RxJS works under the hood.
// Real projects use: npm install rxjs
// ============================================================


// ─────────────────────────────────────────────
// CORE: Observable
//
// An Observable is an object that:
//  1. Takes a "subscriber" function (producer logic)
//  2. When subscribed to, runs that function passing an observer
//  3. Allows cancellation via the returned Subscription
// ─────────────────────────────────────────────

class Observable {
  constructor(subscriberFn) {
    this._subscriberFn = subscriberFn;
  }

  subscribe(observerOrNextFn, errorFn, completeFn) {
    // Normalize observer — accept object or separate functions
    const observer = typeof observerOrNextFn === 'function'
      ? { next: observerOrNextFn, error: errorFn ?? console.error, complete: completeFn ?? (() => {}) }
      : { next: () => {}, error: console.error, complete: () => {}, ...observerOrNextFn };

    let active = true;
    const safeObserver = {
      next(v)  { if (active) observer.next(v); },
      error(e) { if (active) { active = false; observer.error(e); } },
      complete() { if (active) { active = false; observer.complete(); } },
    };

    let cleanup;
    try {
      cleanup = this._subscriberFn(safeObserver);
    } catch (e) {
      safeObserver.error(e);
    }

    // Return a subscription object with unsubscribe()
    return {
      unsubscribe() {
        active = false;
        if (typeof cleanup === 'function') cleanup();
      }
    };
  }

  // ── Operators (chainable) ──

  /** Transform each emitted value */
  map(transformFn) {
    return new Observable(observer => {
      const sub = this.subscribe({
        next:     v => observer.next(transformFn(v)),
        error:    e => observer.error(e),
        complete: () => observer.complete(),
      });
      return () => sub.unsubscribe();
    });
  }

  /** Keep only values passing the predicate */
  filter(predicateFn) {
    return new Observable(observer => {
      const sub = this.subscribe({
        next:     v => { if (predicateFn(v)) observer.next(v); },
        error:    e => observer.error(e),
        complete: () => observer.complete(),
      });
      return () => sub.unsubscribe();
    });
  }

  /** Take only the first N values, then complete */
  take(count) {
    return new Observable(observer => {
      let taken = 0;
      const sub = this.subscribe({
        next(v) {
          if (taken < count) {
            taken++;
            observer.next(v);
            if (taken >= count) observer.complete();
          }
        },
        error:    e => observer.error(e),
        complete: () => observer.complete(),
      });
      return () => sub.unsubscribe();
    });
  }

  /** Accumulate values like Array.reduce, emit running total */
  scan(accFn, seed) {
    return new Observable(observer => {
      let acc = seed;
      const sub = this.subscribe({
        next(v) {
          acc = accFn(acc, v);
          observer.next(acc);
        },
        error:    e => observer.error(e),
        complete: () => observer.complete(),
      });
      return () => sub.unsubscribe();
    });
  }

  /** Wait until silence for `ms` before emitting the last value */
  debounceTime(ms) {
    return new Observable(observer => {
      let timer = null;
      const sub = this.subscribe({
        next(v) {
          clearTimeout(timer);
          timer = setTimeout(() => observer.next(v), ms);
        },
        error:    e => observer.error(e),
        complete: () => { clearTimeout(timer); observer.complete(); },
      });
      return () => { clearTimeout(timer); sub.unsubscribe(); };
    });
  }

  /** Suppress consecutive duplicate values */
  distinctUntilChanged(compareFn = (a, b) => a === b) {
    return new Observable(observer => {
      let last = Symbol('EMPTY'); // sentinel — nothing emitted yet
      const sub = this.subscribe({
        next(v) {
          if (last === Symbol.for('EMPTY') || !compareFn(last, v)) {
            last = v;
            observer.next(v);
          }
        },
        error:    e => observer.error(e),
        complete: () => observer.complete(),
      });
      return () => sub.unsubscribe();
    });
  }

  /** pipe: chain multiple operator functions */
  pipe(...operators) {
    return operators.reduce((obs, op) => op(obs), this);
  }
}

// Factory helpers
Observable.of = (...values) => new Observable(observer => {
  values.forEach(v => observer.next(v));
  observer.complete();
});

Observable.from = (source) => new Observable(observer => {
  if (source && typeof source[Symbol.iterator] === 'function') {
    for (const v of source) observer.next(v);
    observer.complete();
  } else if (source instanceof Promise) {
    source.then(v => { observer.next(v); observer.complete(); }, e => observer.error(e));
  }
});

Observable.interval = (ms) => new Observable(observer => {
  let count = 0;
  const id = setInterval(() => observer.next(count++), ms);
  return () => clearInterval(id);
});

Observable.fromEvent = (element, eventName) => new Observable(observer => {
  const handler = (e) => observer.next(e);
  element.addEventListener(eventName, handler);
  return () => element.removeEventListener(eventName, handler);
});


// ─────────────────────────────────────────────
// SUBJECT
// A Subject is both an Observable AND an Observer.
// All current subscribers receive the same value.
// Use it as an event bus or multicast hub.
// ─────────────────────────────────────────────

class Subject extends Observable {
  constructor() {
    super(observer => {
      this._observers.add(observer);
      return () => this._observers.delete(observer);
    });
    this._observers = new Set();
  }

  next(value) {
    this._observers.forEach(obs => obs.next(value));
  }

  error(err) {
    this._observers.forEach(obs => obs.error(err));
  }

  complete() {
    this._observers.forEach(obs => obs.complete());
    this._observers.clear();
  }
}


// ============================================================
// DEMO FUNCTIONS (called from HTML)
// ============================================================

const reactiveDemo = (() => {

  // ─────────────────────────────────────────────
  // 1. BASIC STREAM
  // ─────────────────────────────────────────────

  function runBasicStream() {
    const lines = [];

    lines.push('--- Observable.of (synchronous) ---');
    Observable.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
      .filter(n => n % 2 === 0)        // 2, 4, 6, 8, 10
      .map(n => n * n)                 // 4, 16, 36, 64, 100
      .take(3)                         // 4, 16, 36
      .scan((sum, n) => sum + n, 0)    // running total: 4, 20, 56
      .subscribe({
        next:     v => lines.push(`  Running sum: ${v}`),
        complete: () => lines.push('  Stream completed.'),
      });

    lines.push('\n--- Observable.from (array) ---');
    const words = ['apple', 'banana', 'avocado', 'blueberry', 'apricot', 'cherry'];
    Observable.from(words)
      .filter(w => w.startsWith('a'))
      .map(w => w.toUpperCase())
      .subscribe(w => lines.push(`  Starts with A: ${w}`));

    lines.push('\n--- Observable.interval (async, 5 ticks) ---');
    const sub = Observable.interval(200)
      .map(n => `tick #${n}`)
      .take(5)
      .subscribe({
        next:     v => { lines.push(`  ${v}`); updateBasicOutput(lines); },
        complete: () => { lines.push('  interval complete.'); updateBasicOutput(lines); },
      });

    function updateBasicOutput(l) {
      document.getElementById('basic-output').textContent = l.join('\n');
    }
    updateBasicOutput(lines);
  }


  // ─────────────────────────────────────────────
  // 2. SUBJECT (multicast)
  // ─────────────────────────────────────────────

  let subject$ = null;
  let subjectLog = [];
  let sub1 = null;
  let sub2 = null;
  let eventCount = 0;

  function setupSubject() {
    subject$ = new Subject();
    subjectLog = [];
    eventCount = 0;
    document.getElementById('subject-pills').innerHTML = '';

    sub1 = subject$.subscribe({
      next: (v) => {
        const msg = `[Observer 1] ${v}`;
        subjectLog.push(msg);
        addPill(msg, '#a6e3a1');
        updateSubjectOutput();
      }
    });

    sub2 = subject$.map(v => `${v} (processed)`).subscribe({
      next: (v) => {
        const msg = `[Observer 2] ${v}`;
        subjectLog.push(msg);
        addPill(msg, '#89b4fa');
        updateSubjectOutput();
      }
    });

    subjectLog.push('Subject created. 2 observers subscribed.');
    updateSubjectOutput();
  }

  function emitEvent() {
    if (!subject$) { setupSubject(); }
    eventCount++;
    subject$.next(`Event #${eventCount} at ${new Date().toLocaleTimeString()}`);
  }

  function unsubscribeOne() {
    if (sub1) {
      sub1.unsubscribe();
      sub1 = null;
      subjectLog.push('Observer 1 unsubscribed. Only Observer 2 receives now.');
      updateSubjectOutput();
    }
  }

  function addPill(text, color) {
    const pill = document.createElement('div');
    pill.className = 'event-pill';
    pill.style.background = color;
    pill.style.color = '#1e1e2e';
    pill.textContent = text;
    document.getElementById('subject-pills').appendChild(pill);
  }

  function updateSubjectOutput() {
    document.getElementById('subject-output').textContent = subjectLog.join('\n');
  }


  // ─────────────────────────────────────────────
  // 3. SEARCH INPUT (debounce + distinctUntilChanged)
  // ─────────────────────────────────────────────

  let searchSubscription = null;

  function initSearch() {
    const input = document.getElementById('search-input');
    const eventsDiv = document.getElementById('search-events');
    const outputEl = document.getElementById('search-output');
    const apiCallLog = [];

    searchSubscription = Observable.fromEvent(input, 'input')
      .map(e => e.target.value.trim())
      .debounceTime(400)               // wait 400ms after last keystroke
      .distinctUntilChanged()          // skip if same as last
      .subscribe(query => {
        // Simulated API call
        const msg = query
          ? `[API] Searching for: "${query}" (${new Date().toLocaleTimeString()})`
          : '[API] Query cleared — no request sent';
        apiCallLog.push(msg);
        outputEl.textContent = apiCallLog.join('\n');

        const pill = document.createElement('div');
        pill.className = 'event-pill';
        pill.textContent = query || '(empty)';
        eventsDiv.appendChild(pill);
        console.log('[Search]', msg);
      });
  }


  // ─────────────────────────────────────────────
  // 4. OPERATORS DEMO
  // ─────────────────────────────────────────────

  function runOperators() {
    const lines = [];

    lines.push('--- scan: running total ---');
    const values = [10, 20, 5, 30, 15];
    Observable.from(values)
      .scan((acc, v) => acc + v, 0)
      .subscribe(v => lines.push(`  Accumulated: ${v}`));

    lines.push('\n--- take + map: first 5 squares ---');
    Observable.interval(0) // 0ms = synchronous-ish
      .map(n => n + 1)     // 1, 2, 3, ...
      .map(n => n * n)     // 1, 4, 9, ...
      .take(5)
      .subscribe(v => lines.push(`  Square: ${v}`));

    lines.push('\n--- filter + take: first 3 primes ---');
    function isPrime(n) {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
      return true;
    }
    Observable.interval(0)
      .filter(isPrime)
      .take(5)
      .subscribe(v => lines.push(`  Prime: ${v}`));

    lines.push('\n--- distinctUntilChanged ---');
    const noisy = [1, 1, 2, 2, 2, 3, 1, 1, 4];
    Observable.from(noisy)
      .distinctUntilChanged()
      .subscribe(v => lines.push(`  Distinct: ${v}`));

    document.getElementById('operators-output').textContent = lines.join('\n');
    console.log('[Operators]\n' + lines.join('\n'));
  }


  // Auto-init search on load
  window.addEventListener('DOMContentLoaded', initSearch);

  return { runBasicStream, setupSubject, emitEvent, unsubscribeOne, runOperators };

})();
