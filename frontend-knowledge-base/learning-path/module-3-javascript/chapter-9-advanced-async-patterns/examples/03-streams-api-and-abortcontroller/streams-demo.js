/* ─────────────────────────────────────────────────────────────────────────
 *  streams-demo.js
 *  Demos for Streams API and AbortController
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ── Logger factory ────────────────────────────────────────────────────────

function makeLogger(id) {
  const el = document.getElementById(id);
  const log = (msg, cls) => {
    const d = document.createElement('div');
    d.textContent = msg;
    d.className = cls;
    el.appendChild(d);
  };
  return {
    clear(title) { el.innerHTML = ''; if (title) log(`=== ${title} ===`, 'log-title'); },
    ok:    msg => log(msg, 'log-success'),
    err:   msg => log(msg, 'log-error'),
    warn:  msg => log(msg, 'log-warn'),
    info:  msg => log(msg, 'log-info'),
    title: msg => log(msg, 'log-title'),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  1. Custom ReadableStream
// ═══════════════════════════════════════════════════════════════════════════

let readableController = null; // Exposed so Cancel button can call it

document.getElementById('btn-readable').addEventListener('click', () => {
  const log = makeLogger('out-readable');
  log.clear('Custom ReadableStream');

  const cancelBtn = document.getElementById('btn-readable-cancel');
  const startBtn  = document.getElementById('btn-readable');

  startBtn.disabled  = true;
  cancelBtn.disabled = false;

  let count = 0;
  let intervalId = null;

  // ── Producer: emits a number every 300 ms ──────────────────────────────
  const readable = new ReadableStream({
    start(controller) {
      readableController = controller;

      intervalId = setInterval(() => {
        if (count >= 8) {
          controller.close();
          clearInterval(intervalId);
          return;
        }
        const chunk = `chunk-${count++}`;
        log.info(`  ▶ Enqueue: "${chunk}"`);
        controller.enqueue(chunk);
      }, 300);
    },

    cancel(reason) {
      clearInterval(intervalId);
      log.warn(`  Stream cancelled: ${reason}`);
    }
  });

  // ── TransformStream: convert each chunk to uppercase ───────────────────
  const upperTransform = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    }
  });

  // ── WritableStream: sink that logs each chunk ──────────────────────────
  const sink = new WritableStream({
    write(chunk) {
      log.ok(`  ✔ Sink received: "${chunk}"`);
    },
    close() {
      log.title('  Stream pipeline closed');
      startBtn.disabled  = false;
      cancelBtn.disabled = true;
    },
    abort(reason) {
      log.err(`  Sink aborted: ${reason}`);
      startBtn.disabled  = false;
      cancelBtn.disabled = true;
    }
  });

  // ── Pipeline: readable ──► upperTransform ──► sink ─────────────────────
  readable
    .pipeThrough(upperTransform)
    .pipeTo(sink)
    .catch(err => log.err(`Pipeline error: ${err.message}`));
});

document.getElementById('btn-readable-cancel').addEventListener('click', () => {
  if (readableController) {
    readableController.cancel('User cancelled');
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  2. TransformStream Pipeline
// ═══════════════════════════════════════════════════════════════════════════

document.getElementById('btn-transform').addEventListener('click', async () => {
  const log = makeLogger('out-transform');
  log.clear('TransformStream pipeline');

  const rawChunks = [
    '  Hello World  ',
    '  Streams Are  ',
    '  Really Cool  ',
    '  JavaScript   ',
  ];

  // Transform 1: trim whitespace from each chunk
  const trimTransform = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.trim());
    }
  });

  // Transform 2: reverse each word in the chunk
  const reverseWordsTransform = new TransformStream({
    transform(chunk, controller) {
      const reversed = chunk
        .split(' ')
        .map(word => word.split('').reverse().join(''))
        .join(' ');
      controller.enqueue(reversed);
    }
  });

  // Build the readable source from our array
  const source = new ReadableStream({
    start(controller) {
      rawChunks.forEach(chunk => {
        log.info(`  Input:  "${chunk}"`);
        controller.enqueue(chunk);
      });
      controller.close();
    }
  });

  // Pipe: source ──► trim ──► reverseWords
  const transformedStream = source
    .pipeThrough(trimTransform)
    .pipeThrough(reverseWordsTransform);

  // Consume via async iteration
  log.title('  Output:');
  for await (const chunk of transformedStream) {
    log.ok(`  Output: "${chunk}"`);
  }
  log.info('  Pipeline complete');
});

// ═══════════════════════════════════════════════════════════════════════════
//  3. Fetch with Stream Progress
// ═══════════════════════════════════════════════════════════════════════════

let fetchController = null;

document.getElementById('btn-fetch-stream').addEventListener('click', async () => {
  const log = makeLogger('out-fetch');
  log.clear('Fetch with stream progress');

  const fetchBtn  = document.getElementById('btn-fetch-stream');
  const cancelBtn = document.getElementById('btn-fetch-cancel');
  const bar       = document.getElementById('progress-bar');

  fetchBtn.disabled  = true;
  cancelBtn.disabled = false;
  bar.style.width    = '0%';
  bar.textContent    = '0%';

  fetchController = new AbortController();

  // A public text file large enough to observe streaming
  // Using a lorem ipsum generator API (returns plain text)
  const url = 'https://loripsum.net/api/10/long/plaintext';

  try {
    const response = await fetch(url, { signal: fetchController.signal });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : null;

    log.info(`Content-Length: ${total !== null ? `${total} bytes` : 'unknown (streaming)'}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let received = 0;
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      received += value.byteLength;
      fullText += decoder.decode(value, { stream: true });

      const pct = total ? Math.round((received / total) * 100) : null;
      const pctStr = pct !== null ? `${pct}%` : '…';

      bar.style.width  = pct !== null ? `${pct}%` : '50%';
      bar.textContent  = `${received} bytes ${pct !== null ? `(${pctStr})` : ''}`;

      log.info(`  Chunk: ${value.byteLength} bytes (total: ${received})`);
    }

    bar.style.width = '100%';
    bar.textContent = `Done — ${received} bytes`;

    log.ok(`\nFirst 200 chars:\n"${fullText.slice(0, 200)}…"`);

  } catch (err) {
    if (err.name === 'AbortError') {
      log.warn('Fetch cancelled by user');
      bar.textContent = 'Cancelled';
    } else {
      log.err(`Error: ${err.message}`);
    }
  } finally {
    fetchBtn.disabled  = false;
    cancelBtn.disabled = true;
  }
});

document.getElementById('btn-fetch-cancel').addEventListener('click', () => {
  fetchController?.abort();
});

// ═══════════════════════════════════════════════════════════════════════════
//  4. AbortController Patterns
// ═══════════════════════════════════════════════════════════════════════════

const abortLog = () => makeLogger('out-abort');

// ── 4a. Manual Abort ──────────────────────────────────────────────────────

document.getElementById('btn-abort-basic').addEventListener('click', async () => {
  const log = abortLog();
  log.clear('Manual Abort');

  const controller = new AbortController();
  const { signal } = controller;

  log.info('Starting slow operation (2000ms)…');

  // Abortable delay utility
  const delayPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve('Done!'), 2000);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });

  // Abort after 600ms
  setTimeout(() => {
    log.warn('Aborting after 600ms…');
    controller.abort('User triggered');
  }, 600);

  try {
    const result = await delayPromise;
    log.ok(`Result: ${result}`);
  } catch (err) {
    if (err.name === 'AbortError') {
      log.err(`Aborted! signal.reason = "${signal.reason}"`);
    }
  }
});

// ── 4b. AbortSignal.timeout() ─────────────────────────────────────────────

document.getElementById('btn-abort-timeout').addEventListener('click', async () => {
  const log = abortLog();
  log.clear('AbortSignal.timeout()');

  // Fast fetch — should succeed
  log.info('Fetch with 5s timeout (should succeed)…');
  try {
    const res = await fetch('https://httpbin.org/delay/0', {
      signal: AbortSignal.timeout(5000),
    });
    log.ok(`Fetch succeeded: HTTP ${res.status}`);
  } catch (err) {
    const name = err.name === 'TimeoutError' ? 'TimeoutError' : err.name;
    log.err(`${name}: ${err.message}`);
  }

  // Intentionally short timeout
  log.info('Fetch with 1ms timeout (should timeout)…');
  try {
    const res = await fetch('https://httpbin.org/delay/2', {
      signal: AbortSignal.timeout(1),
    });
    log.ok(`Fetch succeeded: HTTP ${res.status}`);
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      log.warn(`Timed out as expected: ${err.message}`);
    } else {
      log.err(`Error: ${err.message}`);
    }
  }
});

// ── 4c. AbortSignal.any() — combining signals ─────────────────────────────

document.getElementById('btn-abort-any').addEventListener('click', async () => {
  const log = abortLog();
  log.clear('AbortSignal.any() — first signal wins');

  const userController = new AbortController();

  // If AbortSignal.any is not supported, fall back gracefully
  if (typeof AbortSignal.any !== 'function') {
    log.warn('AbortSignal.any() not supported in this browser. Try Chrome 116+');
    return;
  }

  const combined = AbortSignal.any([
    userController.signal,
    AbortSignal.timeout(2000), // 2 second timeout
  ]);

  log.info('Combined signal: aborts on user cancel OR 2s timeout.');
  log.info('Auto-aborting via user signal in 800ms…');

  setTimeout(() => userController.abort('User navigated away'), 800);

  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 5000);
      combined.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      }, { once: true });
    });
    log.ok('Completed');
  } catch {
    log.warn(`Aborted! reason = "${combined.reason}"`);
  }
});

// ── 4d. Custom abortable delay ────────────────────────────────────────────

/**
 * An async delay that respects an AbortSignal.
 */
function abortableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException(signal.reason ?? 'Aborted', 'AbortError'));
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException(signal.reason ?? 'Aborted', 'AbortError'));
    }, { once: true });
  });
}

document.getElementById('btn-abort-custom').addEventListener('click', async () => {
  const log = abortLog();
  log.clear('Custom Abortable Delay');

  const controller = new AbortController();

  // Scenario 1: completes normally
  log.info('Delay 400ms — completes normally');
  try {
    await abortableDelay(400, controller.signal);
    log.ok('Delay 1 complete ✔');
  } catch (err) {
    log.err(`Delay 1 aborted: ${err.message}`);
  }

  // Scenario 2: aborted early
  log.info('Delay 2000ms — will be aborted after 300ms');
  const ctrl2 = new AbortController();
  setTimeout(() => ctrl2.abort('user cancelled delay'), 300);

  try {
    await abortableDelay(2000, ctrl2.signal);
    log.ok('Delay 2 complete ✔');
  } catch (err) {
    if (err.name === 'AbortError') {
      log.warn(`Delay 2 aborted: "${ctrl2.signal.reason}"`);
    }
  }
});
