/* ─────────────────────────────────────────────────────────────────────────
 *  async-patterns.js
 *  Demos for advanced async/await patterns
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ── Utilities ─────────────────────────────────────────────────────────────

/** Simulated async task — resolves after `ms` ms with optional failure */
function simulatedTask(label, ms, failRate = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error(`${label} failed (simulated)`));
      } else {
        resolve(`${label} done`);
      }
    }, ms);
  });
}

/** Create a log helper bound to a specific output element */
function makeLogger(elementId) {
  const el = document.getElementById(elementId);
  return {
    clear(title) {
      el.innerHTML = '';
      this.title(title);
    },
    title(msg) { append(el, msg, 'log-title'); },
    ok(msg)    { append(el, msg, 'log-success'); },
    err(msg)   { append(el, msg, 'log-error'); },
    warn(msg)  { append(el, msg, 'log-warn'); },
    info(msg)  { append(el, msg, 'log-info'); },
  };
}

function append(el, msg, cls) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.className = cls;
  el.appendChild(div);
}

// ── 1. Sequential vs. Concurrent ─────────────────────────────────────────

document.getElementById('btn-sequential').addEventListener('click', async () => {
  const log = makeLogger('out-sequential');
  log.clear('Sequential execution');

  const tasks = [
    ['Task A', 600],
    ['Task B', 400],
    ['Task C', 500],
  ];

  const start = performance.now();

  // ❌ Sequential — each task waits for the previous to complete
  for (const [label, ms] of tasks) {
    log.info(`  Starting ${label}…`);
    const result = await simulatedTask(label, ms);
    log.ok(`  ✔ ${result}`);
  }

  const elapsed = (performance.now() - start).toFixed(0);
  log.warn(`Total time: ${elapsed}ms  (sum of all delays = ~1500ms)`);
});

document.getElementById('btn-concurrent').addEventListener('click', async () => {
  const log = makeLogger('out-sequential');
  log.clear('Concurrent execution');

  const tasks = [
    ['Task A', 600],
    ['Task B', 400],
    ['Task C', 500],
  ];

  const start = performance.now();

  // ✅ Concurrent — all tasks start simultaneously
  const promises = tasks.map(([label, ms]) => {
    log.info(`  Starting ${label}…`);
    return simulatedTask(label, ms);
  });

  const results = await Promise.all(promises);
  results.forEach(r => log.ok(`  ✔ ${r}`));

  const elapsed = (performance.now() - start).toFixed(0);
  log.ok(`Total time: ${elapsed}ms  (only ~600ms — the slowest task)`);
});

// ── 2. Concurrency Pool ───────────────────────────────────────────────────

/**
 * Run async task factories with a maximum concurrency.
 * @param {Array<() => Promise<any>>} tasks - array of task factories
 * @param {number} concurrency              - max simultaneous tasks
 */
async function runWithConcurrency(tasks, concurrency) {
  const results = new Array(tasks.length);
  const executing = new Set();

  for (const [index, taskFactory] of tasks.entries()) {
    const p = taskFactory().then(result => {
      results[index] = result;
      executing.delete(p);
    });
    executing.add(p);

    if (executing.size >= concurrency) {
      // Wait for one slot to free before starting the next task
      await Promise.race(executing);
    }
  }

  await Promise.all(executing); // Drain remaining tasks
  return results;
}

document.getElementById('btn-pool').addEventListener('click', async () => {
  const log = makeLogger('out-pool');
  log.clear('Concurrency pool (max 3 simultaneous)');

  const taskCount = 8;
  let active = 0;
  let maxActive = 0;

  const tasks = Array.from({ length: taskCount }, (_, i) => () => {
    active++;
    maxActive = Math.max(maxActive, active);
    log.info(`  ▶ Task ${i + 1} started  [active: ${active}]`);

    return simulatedTask(`Task ${i + 1}`, 300 + Math.random() * 400).then(result => {
      active--;
      log.ok(`  ✔ ${result}  [active: ${active}]`);
      return result;
    });
  });

  const start = performance.now();
  const results = await runWithConcurrency(tasks, 3);
  const elapsed = (performance.now() - start).toFixed(0);

  log.warn(`Completed ${taskCount} tasks in ${elapsed}ms (max active at once: ${maxActive})`);
});

// ── 3. safeAwait Error Boundaries ────────────────────────────────────────

/**
 * Wraps a Promise so it never throws.
 * Returns [value, null] on success or [null, error] on failure.
 */
async function safeAwait(promise) {
  try {
    return [await promise, null];
  } catch (err) {
    return [null, err];
  }
}

document.getElementById('btn-safe').addEventListener('click', async () => {
  const log = makeLogger('out-safe');
  log.clear('safeAwait — never throws');

  // Successful operation
  const [dataA, errA] = await safeAwait(simulatedTask('User fetch', 200));
  if (errA) {
    log.err(`Failed to fetch user: ${errA.message}`);
  } else {
    log.ok(`Got data: "${dataA}"`);
  }

  // Failing operation — failRate 1 means always fails
  const [dataB, errB] = await safeAwait(simulatedTask('Profile fetch', 150, 1));
  if (errB) {
    log.warn(`Profile unavailable: ${errB.message} — using defaults`);
  } else {
    log.ok(`Got profile: "${dataB}"`);
  }

  // Promise.allSettled pattern
  log.title('allSettled — audit all outcomes');
  const tasks = [
    simulatedTask('Endpoint A', 150),
    simulatedTask('Endpoint B', 100, 1), // Always fails
    simulatedTask('Endpoint C', 200),
  ];

  const settled = await Promise.allSettled(tasks);
  settled.forEach((result, i) => {
    const label = ['A', 'B', 'C'][i];
    if (result.status === 'fulfilled') {
      log.ok(`  Endpoint ${label}: ✅ ${result.value}`);
    } else {
      log.err(`  Endpoint ${label}: ❌ ${result.reason.message}`);
    }
  });
});

// ── 4. Async Generator & for await…of ────────────────────────────────────

/** Simulates a paginated API — returns one "page" per call */
async function fetchPage(page, pageSize) {
  await new Promise(r => setTimeout(r, 150)); // Simulate network delay
  const startId = (page - 1) * pageSize + 1;
  const users = Array.from({ length: pageSize }, (_, i) => ({
    id: startId + i,
    name: `User ${startId + i}`,
  }));
  return { users, hasMore: page < 4 }; // 4 pages total
}

/** Async generator that lazily yields individual users across pages */
async function* paginateUsers(pageSize = 3) {
  let page = 1;
  while (true) {
    const { users, hasMore } = await fetchPage(page, pageSize);
    yield* users; // Yield each user individually
    if (!hasMore) break;
    page++;
  }
}

document.getElementById('btn-gen').addEventListener('click', async () => {
  const log = makeLogger('out-gen');
  log.clear('Async generator pagination');

  log.info('Iterating users across pages lazily…');

  let count = 0;
  for await (const user of paginateUsers(3)) {
    log.ok(`  [${user.id}] ${user.name}`);
    count++;

    // Early exit demonstration
    if (count >= 7) {
      log.warn('  Early exit — stopping after 7 users');
      break;
    }
  }

  log.info(`Total consumed: ${count} users`);
});

// ── 5. Retry with Exponential Back-off ───────────────────────────────────

/**
 * @param {() => Promise<T>} fn       - operation factory (called fresh each attempt)
 * @param {number} maxRetries         - how many extra attempts after the first
 * @param {number} baseDelayMs        - starting delay in ms (doubles each retry)
 * @param {(attempt: number, err: Error, nextDelay: number) => void} onRetry
 */
async function withRetry(fn, maxRetries = 3, baseDelayMs = 200, onRetry = () => {}) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (attempt === maxRetries) break; // No more retries

      const delay = baseDelayMs * 2 ** attempt;
      onRetry(attempt + 1, err, delay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

document.getElementById('btn-retry').addEventListener('click', async () => {
  const log = makeLogger('out-retry');
  log.clear('Retry with exponential back-off');

  let attempts = 0;
  const maxAttempts = 4;

  // Simulated flaky operation — succeeds on the 3rd attempt
  const flakyOperation = () => {
    attempts++;
    log.info(`  Attempt ${attempts}…`);
    if (attempts < 3) {
      return Promise.reject(new Error(`Network error (attempt ${attempts})`));
    }
    return Promise.resolve(`Data loaded on attempt ${attempts}`);
  };

  try {
    const result = await withRetry(
      flakyOperation,
      maxAttempts,
      100,
      (attempt, err, delay) => {
        log.warn(`  ↩ Attempt ${attempt} failed: "${err.message}". Retrying in ${delay}ms…`);
      }
    );
    log.ok(`✅ Success: "${result}"`);
  } catch (err) {
    log.err(`❌ All ${maxAttempts + 1} attempts failed: ${err.message}`);
  } finally {
    attempts = 0; // Reset for a re-run
  }
});
