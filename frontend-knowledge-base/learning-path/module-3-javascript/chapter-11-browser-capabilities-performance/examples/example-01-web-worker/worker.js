/**
 * worker.js — Runs in a dedicated background thread.
 *
 * Rules inside a worker:
 *  - NO access to `document`, `window`, or the DOM
 *  - CAN use: fetch, setTimeout, IndexedDB, WebSockets, crypto, etc.
 *  - Communicate with main thread via self.postMessage / self.onmessage
 */

self.onmessage = function (event) {
  const { limit, buffer } = event.data;

  // Handle transferable demo — just echo back
  if (buffer) {
    console.log('[worker] Received transferred buffer, byteLength:', buffer.byteLength);
    self.postMessage({ echo: 'buffer received' });
    return;
  }

  if (!limit || limit === 0) {
    self.postMessage({ count: 0 });
    return;
  }

  // Sieve of Eratosthenes using a typed array for memory efficiency
  const sieve = new Uint8Array(limit + 1).fill(1);
  sieve[0] = sieve[1] = 0;

  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = 0;
      }
    }
  }

  let count = 0;
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) count++;
  }

  // Send result back to main thread
  self.postMessage({ count });
};
