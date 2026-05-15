// ============================================================
// Example 9: Capstone — All Four Concepts Working Together
//
// We build a small observable event-bus system that uses:
//  - `this` / bind (correct context in callbacks)
//  - Prototypal inheritance / classes
//  - Closures (private state, factory functions)
//  - Iterators, Generators, Symbols (custom protocols)
// ============================================================
// Run: node index.js

// ----------------------------------------------------------
// STEP 1: EventEmitter base class (Prototype + Classes)
// ----------------------------------------------------------

class EventEmitter {
  #listeners = new Map(); // private — closure-like encapsulation via # field

  on(event, listener) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(listener);
    return this; // chainable
  }

  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
    return this;
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach(listener => listener.apply(this, args));
    return this;
  }

  once(event, listener) {
    // Closure: wraps listener and removes itself after first call
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  // Iterator: yield all registered event names
  *[Symbol.iterator]() {
    yield* this.#listeners.keys();
  }
}

// ----------------------------------------------------------
// STEP 2: Observable Store (Extends EventEmitter + Closures)
// ----------------------------------------------------------

const STORE_SYMBOL = Symbol('store'); // unique key for internal data

class Store extends EventEmitter {
  [STORE_SYMBOL] = {}; // symbol-keyed "semi-private" state

  constructor(initialState = {}) {
    super();
    this[STORE_SYMBOL] = { ...initialState };
  }

  getState() {
    return { ...this[STORE_SYMBOL] }; // return a shallow copy
  }

  setState(patch) {
    const prev = this.getState();
    this[STORE_SYMBOL] = { ...this[STORE_SYMBOL], ...patch };
    const next = this.getState();
    this.emit('change', next, prev);
    // Emit per-key events for granular subscriptions
    for (const key of Object.keys(patch)) {
      this.emit(`change:${key}`, next[key], prev[key]);
    }
    return this;
  }

  // Generator: yield state snapshots over time (for testing/logging)
  *history(changeLog) {
    for (const snapshot of changeLog) {
      yield snapshot;
    }
  }
}

// ----------------------------------------------------------
// STEP 3: Logger middleware using `bind` and closures
// ----------------------------------------------------------

function createLogger(prefix) {
  // `prefix` is captured in the closure
  return function logChange(next, prev) {
    // `this` is the Store (because emit calls apply(this, args))
    const changed = Object.keys(next).filter(k => next[k] !== prev[k]);
    console.log(`${prefix} [${changed.join(', ')}] →`, next);
  };
}

// ----------------------------------------------------------
// STEP 4: Validation using Symbols and Generators
// ----------------------------------------------------------

const VALIDATORS = Symbol('validators');

class ValidatedStore extends Store {
  [VALIDATORS] = {};

  addValidator(key, validatorFn) {
    this[VALIDATORS][key] = validatorFn;
    return this;
  }

  setState(patch) {
    // Run validators (generator to collect all errors lazily)
    const errors = [...this.#validatePatch(patch)];
    if (errors.length > 0) {
      console.error('Validation failed:', errors);
      return this;
    }
    return super.setState(patch);
  }

  *#validatePatch(patch) {
    for (const [key, value] of Object.entries(patch)) {
      const validate = this[VALIDATORS][key];
      if (validate) {
        const error = validate(value);
        if (error) yield `${key}: ${error}`;
      }
    }
  }
}

// ----------------------------------------------------------
// STEP 5: Wire it all together
// ----------------------------------------------------------

const store = new ValidatedStore({ count: 0, name: 'Alice', active: true });

// Add validators
store
  .addValidator('count', v => typeof v !== 'number' ? 'must be a number' : null)
  .addValidator('name',  v => v.length < 2 ? 'too short' : null);

// Subscribe with automatic `this` binding
const logger = createLogger('[Store]');
store.on('change', logger);

// Granular subscription
store.on('change:count', (next, prev) => {
  console.log(`  Count changed: ${prev} → ${next}`);
});

// One-time subscription
store.once('change:name', (next, prev) => {
  console.log(`  Name changed for the first time: ${prev} → ${next}`);
});

console.log('\n--- Valid updates ---');
store.setState({ count: 1 });
store.setState({ count: 2, name: 'Bob' });
store.setState({ name: 'Carol' }); // once() listener already fired, not called again

console.log('\n--- Invalid updates (validators reject) ---');
store.setState({ count: 'not-a-number' }); // validation fails
store.setState({ name: 'X' });             // validation fails

console.log('\n--- Iterate registered events ---');
for (const event of store) {
  console.log('Registered event:', event);
}

console.log('\n--- Final state ---');
console.log(store.getState());
