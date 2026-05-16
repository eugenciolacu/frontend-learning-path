/**
 * main.js — Orchestrates the Web Worker demo.
 *
 * Key concepts demonstrated:
 *  - Creating a Worker from a separate file
 *  - Communicating via postMessage / onmessage
 *  - Terminating a Worker with worker.terminate()
 *  - Transferring data (ArrayBuffer) for zero-copy performance
 */

// ─── DOM references ───────────────────────────────────────────────────────────
const btnMain        = document.getElementById('btn-main');
const btnWorker      = document.getElementById('btn-worker');
const btnStop        = document.getElementById('btn-stop');
const resultMain     = document.getElementById('result-main');
const resultWorker   = document.getElementById('result-worker');
const statusBadge    = document.getElementById('status-badge');

// ─── Shared limit ─────────────────────────────────────────────────────────────
const LIMIT = 5_000_000;

// ─── Utility: simple Sieve of Eratosthenes ────────────────────────────────────
function countPrimes(limit) {
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
  return count;
}

// ─── Main-thread version (BLOCKING) ──────────────────────────────────────────
btnMain.addEventListener('click', () => {
  resultMain.textContent = `Computing primes up to ${LIMIT.toLocaleString()}…`;
  statusBadge.textContent = 'BLOCKED!';
  statusBadge.classList.add('busy');

  // Give the browser one frame to repaint before blocking
  setTimeout(() => {
    const t0    = performance.now();
    const count = countPrimes(LIMIT);
    const ms    = (performance.now() - t0).toFixed(1);

    resultMain.textContent =
      `Found ${count.toLocaleString()} primes in ${ms} ms (main thread — was frozen)`;

    statusBadge.textContent = 'Idle';
    statusBadge.classList.remove('busy');
  }, 50);
});

// ─── Worker version (NON-BLOCKING) ────────────────────────────────────────────
let worker = null;

btnWorker.addEventListener('click', () => {
  if (worker) return; // already running

  // Create the worker from a separate file
  worker = new Worker('worker.js');

  btnWorker.disabled = true;
  btnStop.disabled   = false;
  resultWorker.textContent = `Worker started — computing primes up to ${LIMIT.toLocaleString()}…`;
  statusBadge.textContent = 'Worker running';

  const t0 = performance.now();

  // Send work to the worker
  worker.postMessage({ limit: LIMIT });

  // Receive result from worker
  worker.onmessage = (event) => {
    const ms = (performance.now() - t0).toFixed(1);
    resultWorker.textContent =
      `Found ${event.data.count.toLocaleString()} primes in ${ms} ms (worker — UI stayed alive!)`;

    cleanup();
  };

  worker.onerror = (err) => {
    resultWorker.textContent = `Worker error: ${err.message}`;
    cleanup();
  };
});

btnStop.addEventListener('click', () => {
  if (worker) {
    worker.terminate();
    resultWorker.textContent = 'Worker terminated by user.';
    cleanup();
  }
});

function cleanup() {
  worker = null;
  btnWorker.disabled = false;
  btnStop.disabled   = true;
  statusBadge.textContent = 'Idle';
  statusBadge.classList.remove('busy');
}

// ─── Transferable objects demo (bonus — logged to console) ────────────────────
(function demoTransferable() {
  const transferWorker = new Worker('worker.js');

  // Create a 1 MB buffer and TRANSFER it (zero-copy)
  const buffer = new ArrayBuffer(1024 * 1024);
  console.log('Before transfer — buffer.byteLength:', buffer.byteLength); // 1048576

  transferWorker.postMessage({ buffer, limit: 0 }, [buffer]);

  // The buffer is now detached in the main thread
  console.log('After transfer  — buffer.byteLength:', buffer.byteLength);  // 0

  transferWorker.onmessage = () => transferWorker.terminate();
})();
