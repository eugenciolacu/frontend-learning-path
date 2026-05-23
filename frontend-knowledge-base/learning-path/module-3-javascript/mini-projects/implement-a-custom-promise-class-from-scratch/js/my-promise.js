/* ─────────────────────────────────────────────────────────────────────────
 *  my-promise.js
 *  Promises/A+ compliant custom Promise implementation.
 *
 *  Chapter 9  – Promises under the hood: state machine, microtask scheduling,
 *               thenable resolution, static combinators
 *  Chapter 8  – Private class fields (#), closures, explicit this binding (.call)
 *  Chapter 1  – const, data types (string), Object.freeze()
 *  Chapter 2  – Arrow functions, if/return early-exit, for loop, try/catch
 *  Chapter 3  – Array.forEach, Array.map, new Array(n), destructuring
 * ─────────────────────────────────────────────────────────────────────────
 */

// Chapter 1: const for module-level constants
// Chapter 3: Object.freeze() — immutable state enum (functional programming, Ch.10)
const STATE = Object.freeze({
  PENDING:   'pending',
  FULFILLED: 'fulfilled',
  REJECTED:  'rejected',
});

/**
 * MyPromise — Promises/A+ compliant implementation.
 *
 * State machine (Chapter 9 §1.1):
 *   Pending ──resolve(value)──► Fulfilled
 *           ──reject(reason)──► Rejected
 *
 * Once settled, further resolve/reject calls are silently ignored.
 */
class MyPromise {
  // Chapter 8: Private class fields — external code cannot read or mutate state
  #state    = STATE.PENDING;
  #value    = undefined;
  #handlers = []; // Array<{ onFulfilled, onRejected, resolve, reject }>

  /**
   * @param {(resolve: Function, reject: Function) => void} executor
   * The executor runs synchronously in the constructor.
   * If it throws, the promise is rejected with the thrown error.
   */
  constructor(executor) {
    try {
      executor(
        value  => this.#resolve(value),
        reason => this.#reject(reason),
      );
    } catch (err) {
      this.#reject(err);
    }
  }

  // ── Private state-transition helpers ──────────────────────────────────

  #resolve(value) {
    if (this.#state !== STATE.PENDING) return; // Already settled — no-op

    // Promises/A+ §2.3 — Thenable resolution:
    // If resolved with an object/function that has a .then method,
    // adopt its eventual state rather than fulfilling with the thenable itself.
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      let then;
      try {
        then = value.then; // Accessing .then can throw (§2.3.3.1)
      } catch (err) {
        this.#reject(err);
        return;
      }

      if (typeof then === 'function') {
        // Chapter 8: explicit this binding via .call() (§2.3.3.3)
        let settled = false; // Guard: only the first call counts
        try {
          then.call(
            value,
            v => { if (!settled) { settled = true; this.#resolve(v); } },
            r => { if (!settled) { settled = true; this.#reject(r);  } },
          );
        } catch (err) {
          if (!settled) this.#reject(err);
        }
        return;
      }
    }

    this.#state = STATE.FULFILLED;
    this.#value = value;
    this.#runHandlers();
  }

  #reject(reason) {
    if (this.#state !== STATE.PENDING) return;
    this.#state = STATE.REJECTED;
    this.#value = reason;
    this.#runHandlers();
  }

  /**
   * Schedules all queued handlers as microtasks.
   *
   * Chapter 9 §1.2 — queueMicrotask ensures .then() callbacks are always
   * asynchronous, even when the promise is already settled at registration
   * time. Microtasks run after the current synchronous code but before the
   * next macrotask (setTimeout).
   */
  #runHandlers() {
    queueMicrotask(() => {
      this.#handlers.forEach(({ onFulfilled, onRejected, resolve, reject }) => {
        try {
          if (this.#state === STATE.FULFILLED) {
            // Chapter 1: ternary — pass value through if handler is not a function
            resolve(
              typeof onFulfilled === 'function'
                ? onFulfilled(this.#value)
                : this.#value,
            );
          } else {
            if (typeof onRejected === 'function') {
              resolve(onRejected(this.#value)); // Handled — fulfil the next promise
            } else {
              reject(this.#value);              // Propagate rejection down the chain
            }
          }
        } catch (err) {
          reject(err); // Handler threw — reject the next promise
        }
      });
      this.#handlers = []; // Clear after processing
    });
  }

  // ── Public instance methods ────────────────────────────────────────────

  /**
   * Registers fulfillment and/or rejection handlers.
   * ALWAYS returns a NEW MyPromise — this enables chaining (Chapter 9 §1.3).
   *
   * If the handler returns a thenable, the chain waits for it to settle
   * (flattening — no nested .then() pyramids).
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handler = { onFulfilled, onRejected, resolve, reject };

      if (this.#state === STATE.PENDING) {
        this.#handlers.push(handler); // Queue for when the promise settles
      } else {
        // Already settled — schedule immediately via microtask
        this.#handlers = [handler];
        this.#runHandlers();
      }
    });
  }

  /**
   * Shorthand: .then(undefined, onRejected).
   * Catches rejections and allows recovery.
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  /**
   * Runs onFinally regardless of fulfillment or rejection.
   * Does NOT receive the value/reason — passes them through unchanged.
   *
   * Chapter 5: mental model mirrors try/catch/finally.
   */
  finally(onFinally) {
    return this.then(
      value  => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { throw reason; }),
    );
  }

  // ── Static factory methods ─────────────────────────────────────────────

  /** Returns a promise already fulfilled with `value`. */
  static resolve(value) {
    if (value instanceof MyPromise) return value; // Short-circuit optimisation
    return new MyPromise(resolve => resolve(value));
  }

  /** Returns a promise already rejected with `reason`. */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  /**
   * Resolves when ALL promises fulfill; rejects on the first rejection.
   * Fires all promises concurrently — not sequentially (Chapter 9 §2.1).
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      // Chapter 3: pre-allocated array preserves insertion order
      const results  = new Array(promises.length);
      let remaining  = promises.length;

      if (remaining === 0) { resolve(results); return; }

      // Chapter 3: forEach — iterate with index
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(value => {
          results[i] = value;
          if (--remaining === 0) resolve(results);
        }, reject); // First rejection short-circuits
      });
    });
  }

  /**
   * Settles with the FIRST promise that settles (either direction).
   * Other promises continue running but their outcomes are discarded.
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject));
    });
  }

  /**
   * Waits for ALL promises to settle. Never rejects.
   * Returns an array of { status: 'fulfilled', value }
   *                   or { status: 'rejected',  reason } objects.
   */
  static allSettled(promises) {
    // Chapter 10: composition — built from MyPromise.all + .then() transforms
    return MyPromise.all(
      promises.map(p =>
        MyPromise.resolve(p).then(
          value  => ({ status: 'fulfilled', value }),
          reason => ({ status: 'rejected',  reason }),
        ),
      ),
    );
  }

  /**
   * Resolves with the FIRST fulfilled promise.
   * Rejects with AggregateError only if ALL promises reject.
   * ES2021 — Promise.any equivalent.
   */
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const errors  = new Array(promises.length);
      let remaining = promises.length;

      if (remaining === 0) {
        reject(new AggregateError([], 'All promises were rejected'));
        return;
      }

      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(resolve, reason => {
          errors[i] = reason;
          if (--remaining === 0) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
      });
    });
  }

  /**
   * Returns { promise, resolve, reject } — separates creation from resolution.
   * Useful when resolve/reject must be called from outside the executor.
   * Chapter 9 — advanced async orchestration pattern.
   */
  static withResolvers() {
    let resolve, reject;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject  = rej;
    });
    return { promise, resolve, reject };
  }
}

export { MyPromise, STATE };
