/* ─────────────────────────────────────────────────────────────────────────
 *  my-promise.js
 *  Minimal Promises/A+ compliant implementation
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

const STATE = Object.freeze({ PENDING: 0, FULFILLED: 1, REJECTED: 2 });

class MyPromise {
  // Private fields — prevent external state mutation
  #state = STATE.PENDING;
  #value = undefined;
  #handlers = []; // Array of { onFulfilled, onRejected, resolve, reject }

  /**
   * @param {(resolve: Function, reject: Function) => void} executor
   * The executor runs synchronously inside the constructor.
   */
  constructor(executor) {
    try {
      executor(
        value  => this.#resolve(value),
        reason => this.#reject(reason)
      );
    } catch (err) {
      // If the executor throws, reject the promise
      this.#reject(err);
    }
  }

  // ── Private state transition helpers ──────────────────────────────────

  #resolve(value) {
    if (this.#state !== STATE.PENDING) return; // Already settled — ignore

    // Promises/A+ §2.3.3: if value is a thenable, adopt its state
    if (value !== null && typeof value === 'object' || typeof value === 'function') {
      let then;
      try {
        then = value.then;
      } catch (err) {
        this.#reject(err);
        return;
      }

      if (typeof then === 'function') {
        let settled = false;
        try {
          then.call(
            value,
            v => { if (!settled) { settled = true; this.#resolve(v); } },
            r => { if (!settled) { settled = true; this.#reject(r); } }
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
   * Using queueMicrotask ensures .then() is always asynchronous,
   * even when the promise is already settled.
   */
  #runHandlers() {
    queueMicrotask(() => {
      this.#handlers.forEach(({ onFulfilled, onRejected, resolve, reject }) => {
        try {
          if (this.#state === STATE.FULFILLED) {
            // If onFulfilled is not a function, pass through the value
            resolve(
              typeof onFulfilled === 'function'
                ? onFulfilled(this.#value)
                : this.#value
            );
          } else {
            // If onRejected is not a function, propagate the rejection
            if (typeof onRejected === 'function') {
              resolve(onRejected(this.#value)); // Handled — resolve the chain
            } else {
              reject(this.#value); // Unhandled — propagate
            }
          }
        } catch (err) {
          reject(err); // Handler threw — reject the next promise in the chain
        }
      });
      this.#handlers = []; // Clear after processing
    });
  }

  // ── Public instance methods ────────────────────────────────────────────

  /**
   * Registers fulfillment and/or rejection handlers.
   * Always returns a new MyPromise — enabling chaining.
   */
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handler = { onFulfilled, onRejected, resolve, reject };

      if (this.#state === STATE.PENDING) {
        // Not yet settled — queue for later
        this.#handlers.push(handler);
      } else {
        // Already settled — schedule immediately via microtask
        this.#handlers = [handler];
        this.#runHandlers();
      }
    });
  }

  /** Shorthand for .then(undefined, onRejected) */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  /**
   * Runs onFinally regardless of outcome.
   * Does NOT receive the value/reason, and passes it through unchanged.
   */
  finally(onFinally) {
    return this.then(
      value  => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
    );
  }

  // ── Static factory methods ─────────────────────────────────────────────

  /** Returns a promise already fulfilled with `value` */
  static resolve(value) {
    if (value instanceof MyPromise) return value; // Optimisation
    return new MyPromise(resolve => resolve(value));
  }

  /** Returns a promise already rejected with `reason` */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  /**
   * Resolves when ALL promises fulfill.
   * Rejects immediately on the first rejection.
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = new Array(promises.length);
      let remaining = promises.length;

      if (remaining === 0) {
        resolve(results);
        return;
      }

      promises.forEach((p, index) => {
        MyPromise.resolve(p).then(value => {
          results[index] = value;
          if (--remaining === 0) resolve(results);
        }, reject); // Reject on first failure
      });
    });
  }

  /**
   * Settles with the first promise that settles (fulfilled or rejected).
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => {
        MyPromise.resolve(p).then(resolve, reject);
      });
    });
  }

  /**
   * Waits for ALL promises to settle (never rejects).
   * Returns array of { status, value } or { status, reason } objects.
   */
  static allSettled(promises) {
    return MyPromise.all(
      promises.map(p =>
        MyPromise.resolve(p).then(
          value  => ({ status: 'fulfilled', value }),
          reason => ({ status: 'rejected', reason })
        )
      )
    );
  }

  /**
   * Resolves with the FIRST fulfilled promise.
   * Rejects only if ALL promises reject.
   */
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const errors = new Array(promises.length);
      let remaining = promises.length;

      if (remaining === 0) {
        reject(new AggregateError([], 'All promises were rejected'));
        return;
      }

      promises.forEach((p, index) => {
        MyPromise.resolve(p).then(resolve, reason => {
          errors[index] = reason;
          if (--remaining === 0) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        });
      });
    });
  }

  /** Developer-friendly string representation */
  toString() {
    const stateNames = ['pending', 'fulfilled', 'rejected'];
    const name = stateNames[this.#state];
    return this.#state === STATE.PENDING
      ? `MyPromise { <${name}> }`
      : `MyPromise { ${name}: ${JSON.stringify(this.#value)} }`;
  }
}

// Expose globally for demo.js
window.MyPromise = MyPromise;
