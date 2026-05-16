/**
 * utils.js — Reusable event-management utilities.
 *
 * Exports (as globals for demo purposes):
 *  - debounce(fn, delay)          — trailing-edge debounce
 *  - debounceLeading(fn, delay)   — leading-edge debounce
 *  - throttle(fn, interval)       — time-based throttle
 *  - rafThrottle(fn)              — requestAnimationFrame throttle
 */

/**
 * debounce — Trailing edge
 * Executes fn only after `delay` ms have passed since the LAST call.
 *
 * @param {Function} fn     - Function to debounce
 * @param {number}   delay  - Milliseconds to wait after last invocation
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timerId = null;

  return function debounced(...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delay);
  };
}

/**
 * debounceLeading — Leading edge
 * Executes fn IMMEDIATELY on first call, then ignores calls for `delay` ms.
 * Useful for "click once, ignore spam" patterns.
 *
 * @param {Function} fn
 * @param {number}   delay
 * @returns {Function}
 */
function debounceLeading(fn, delay) {
  let timerId = null;

  return function debouncedLeading(...args) {
    if (!timerId) {
      fn.apply(this, args); // fire immediately on first call
    }

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
}

/**
 * throttle — Time-based
 * Executes fn at most once per `interval` ms, no matter how many calls come in.
 * Uses Date.now() so it works correctly even if the timer drifts.
 *
 * @param {Function} fn
 * @param {number}   interval  - Minimum ms between executions
 * @returns {Function}
 */
function throttle(fn, interval) {
  let lastCall = 0;

  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * rafThrottle — requestAnimationFrame-based throttle.
 * Guarantees at most one call per animation frame (~16ms / 60fps).
 * Best for visual updates (parallax, canvas, scroll indicators).
 *
 * @param {Function} fn
 * @returns {Function}
 */
function rafThrottle(fn) {
  let rafId = null;

  return function rafThrottled(...args) {
    if (rafId !== null) return; // already scheduled for this frame

    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = null;
    });
  };
}
