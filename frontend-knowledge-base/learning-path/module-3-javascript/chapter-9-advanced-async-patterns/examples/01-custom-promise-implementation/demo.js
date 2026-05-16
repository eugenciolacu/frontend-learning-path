/* ─────────────────────────────────────────────────────────────────────────
 *  demo.js
 *  Interactive demos for the MyPromise implementation
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

const output = document.getElementById('output');

/** Append a line to the output area */
function log(msg, style = '') {
  const line = document.createElement('div');
  line.textContent = msg;
  if (style) line.className = style;
  output.appendChild(line);
}

function clearOutput(title) {
  output.innerHTML = '';
  log(`=== ${title} ===`, 'log-title');
}

// ── Demo 1: Basic Resolve and Reject ──────────────────────────────────────

document.getElementById('btn-basic').addEventListener('click', () => {
  clearOutput('Basic Resolve / Reject');

  // Fulfilled promise
  const fulfilled = new MyPromise((resolve) => {
    resolve('Success value');
  });
  fulfilled.then(v => log(`✅ Fulfilled with: "${v}"`, 'log-success'));

  // Rejected promise
  const rejected = new MyPromise((_, reject) => {
    reject(new Error('Something went wrong'));
  });
  rejected.catch(err => log(`❌ Rejected with: "${err.message}"`, 'log-error'));

  // Executor throws
  const throws = new MyPromise(() => {
    throw new TypeError('Executor threw synchronously');
  });
  throws.catch(err => log(`⚠️  Thrown: "${err.message}"`, 'log-warn'));

  // Already settled — second resolve is ignored
  const settled = new MyPromise((resolve) => {
    resolve('First');
    resolve('Second'); // Ignored
  });
  settled.then(v => log(`🔒 Settled once: "${v}" (second resolve ignored)`, 'log-info'));
});

// ── Demo 2: Promise Chain ─────────────────────────────────────────────────

document.getElementById('btn-chain').addEventListener('click', () => {
  clearOutput('Promise Chain');

  log('Starting chain…', 'log-info');

  MyPromise.resolve(1)
    .then(v => {
      log(`  Step 1: received ${v}`, 'log-success');
      return v + 1;
    })
    .then(v => {
      log(`  Step 2: received ${v}`, 'log-success');
      return new MyPromise(resolve => setTimeout(() => resolve(v * 10), 300));
    })
    .then(v => {
      log(`  Step 3 (after async delay): received ${v}`, 'log-success');
      throw new Error('Intentional error in step 4');
    })
    .catch(err => {
      log(`  Caught: ${err.message}`, 'log-error');
      return 'recovered';
    })
    .then(v => {
      log(`  Step 5 (after recovery): "${v}"`, 'log-success');
    })
    .finally(() => {
      log('  Finally: always runs', 'log-info');
    });
});

// ── Demo 3: Microtask Ordering ────────────────────────────────────────────

document.getElementById('btn-microtask').addEventListener('click', () => {
  clearOutput('Microtask Order');

  log('[sync] 1 — start', 'log-info');

  MyPromise.resolve().then(() => log('[microtask] 3 — MyPromise.then', 'log-success'));
  Promise.resolve().then(() => log('[microtask] 3 — native Promise.then', 'log-success'));

  setTimeout(() => log('[macrotask] 4 — setTimeout(0)', 'log-warn'), 0);

  log('[sync] 2 — end', 'log-info');
  log('— Expected order: 1, 2, microtasks, 4 —', 'log-title');
});

// ── Demo 4: MyPromise.all ─────────────────────────────────────────────────

document.getElementById('btn-all').addEventListener('click', () => {
  clearOutput('MyPromise.all');

  function fakeRequest(label, delay, shouldFail = false) {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error(`${label} failed`));
        } else {
          resolve(`${label} result`);
          log(`  ✔ ${label} resolved after ${delay}ms`, 'log-success');
        }
      }, delay);
    });
  }

  // All succeed
  log('— All succeed —', 'log-title');
  MyPromise.all([
    fakeRequest('Task A', 200),
    fakeRequest('Task B', 400),
    fakeRequest('Task C', 100),
  ]).then(results => {
    log(`All resolved: [${results.join(', ')}]`, 'log-success');
  });

  // One fails
  setTimeout(() => {
    log('— One fails —', 'log-title');
    MyPromise.all([
      fakeRequest('Task D', 200),
      fakeRequest('Task E', 150, true), // Fails
      fakeRequest('Task F', 300),
    ])
      .then(results => log(`All resolved: ${results}`, 'log-success'))
      .catch(err => log(`Rejected: ${err.message}`, 'log-error'));
  }, 600);

  // allSettled — never rejects
  setTimeout(() => {
    log('— allSettled (no rejection thrown) —', 'log-title');
    MyPromise.allSettled([
      fakeRequest('Task G', 100),
      fakeRequest('Task H', 150, true),
      fakeRequest('Task I', 200),
    ]).then(results => {
      results.forEach((r, i) => {
        const label = ['G', 'H', 'I'][i];
        if (r.status === 'fulfilled') {
          log(`  Task ${label}: ✅ ${r.value}`, 'log-success');
        } else {
          log(`  Task ${label}: ❌ ${r.reason.message}`, 'log-error');
        }
      });
    });
  }, 1200);
});

// ── Demo 5: MyPromise.race ────────────────────────────────────────────────

document.getElementById('btn-race').addEventListener('click', () => {
  clearOutput('MyPromise.race');

  function delayedValue(value, ms) {
    return new MyPromise(resolve => setTimeout(() => resolve(value), ms));
  }

  function delayedRejection(reason, ms) {
    return new MyPromise((_, reject) => setTimeout(() => reject(new Error(reason)), ms));
  }

  log('Racing three promises (100ms, 250ms, 500ms)…', 'log-info');

  MyPromise.race([
    delayedValue('🐢 slow (500ms)', 500),
    delayedValue('🐇 fast (100ms)', 100),
    delayedValue('🦊 medium (250ms)', 250),
  ]).then(winner => log(`Winner: ${winner}`, 'log-success'));

  // Race as timeout pattern
  log('Race with 300ms timeout…', 'log-info');
  MyPromise.race([
    delayedValue('Data arrived (200ms)', 200),
    new MyPromise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout!')), 300)
    ),
  ])
    .then(v => log(`  Data: "${v}"`, 'log-success'))
    .catch(err => log(`  Timeout: ${err.message}`, 'log-error'));

  // Timeout fires before data
  setTimeout(() => {
    log('Race with 50ms timeout (should timeout)…', 'log-info');
    MyPromise.race([
      delayedValue('Very slow data (500ms)', 500),
      new MyPromise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout!')), 50)
      ),
    ])
      .then(v => log(`  Data: "${v}"`, 'log-success'))
      .catch(err => log(`  Timeout: ${err.message}`, 'log-error'));
  }, 400);
});
