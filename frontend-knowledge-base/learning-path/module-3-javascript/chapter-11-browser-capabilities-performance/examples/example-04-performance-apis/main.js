/**
 * main.js — Performance APIs demonstration.
 *
 * Covers:
 *  1. Navigation Timing API  — page load milestones
 *  2. Resource Timing API    — per-resource load costs
 *  3. User Timing API        — custom marks & measures
 *  4. PerformanceObserver    — reactive entry streaming
 *  5. Long Task detection    — main-thread blocking
 *  6. Core Web Vitals        — LCP, CLS capture
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (ms) => (ms == null || isNaN(ms) ? '—' : ms.toFixed(1));

function colorClass(ms, good, warn) {
  if (ms <= good) return 'good';
  if (ms <= warn) return 'warn';
  return 'bad';
}

function appendToLog(containerId, text, cssClass = '') {
  const el  = document.getElementById(containerId);
  const line = document.createElement('div');
  line.className = cssClass;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

// ─── 1. Navigation Timing ─────────────────────────────────────────────────────
document.getElementById('btn-nav').addEventListener('click', () => {
  // Use PerformanceNavigationTiming (Level 2)
  const [nav] = performance.getEntriesByType('navigation');
  if (!nav) {
    alert('Navigation timing not available (file:// URLs may have limited support).');
    return;
  }

  const ttfb     = nav.responseStart - nav.requestStart;
  const dns      = nav.domainLookupEnd - nav.domainLookupStart;
  const tcp      = nav.connectEnd - nav.connectStart;
  const download = nav.responseEnd - nav.responseStart;
  const domParse = nav.domContentLoadedEventEnd - nav.responseEnd;
  const total    = nav.loadEventEnd - nav.startTime;

  const values = { ttfb, dns, tcp, download, domParse, total };

  document.getElementById('m-ttfb').textContent     = fmt(ttfb);
  document.getElementById('m-dns').textContent      = fmt(dns);
  document.getElementById('m-tcp').textContent      = fmt(tcp);
  document.getElementById('m-download').textContent = fmt(download);
  document.getElementById('m-domparse').textContent = fmt(domParse);
  document.getElementById('m-total').textContent    = fmt(total);

  // Color TTFB (good < 200ms, warn < 600ms)
  const ttfbEl = document.getElementById('m-ttfb').parentElement;
  ttfbEl.classList.add(colorClass(ttfb, 200, 600));
});

// Show raw navigation entry
let rawVisible = false;
document.getElementById('btn-nav-raw').addEventListener('click', () => {
  const rawEl = document.getElementById('nav-raw');
  if (rawVisible) {
    rawEl.style.display = 'none';
    rawVisible = false;
    return;
  }
  const [nav] = performance.getEntriesByType('navigation');
  if (!nav) return;

  const keys = [
    'fetchStart', 'domainLookupStart', 'domainLookupEnd',
    'connectStart', 'connectEnd', 'secureConnectionStart',
    'requestStart', 'responseStart', 'responseEnd',
    'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd',
    'loadEventStart', 'loadEventEnd', 'duration',
    'transferSize', 'encodedBodySize', 'decodedBodySize',
    'type', 'redirectCount',
  ];

  const data = {};
  keys.forEach((k) => { data[k] = typeof nav[k] === 'number' ? parseFloat(nav[k].toFixed(2)) : nav[k]; });
  rawEl.textContent   = JSON.stringify(data, null, 2);
  rawEl.style.display = 'block';
  rawVisible = true;
});

// ─── 2. Resource Timing ───────────────────────────────────────────────────────
document.getElementById('btn-resources').addEventListener('click', () => {
  const resources = performance.getEntriesByType('resource');
  const output    = document.getElementById('resource-output');

  if (resources.length === 0) {
    output.textContent = 'No resource timing entries found.\nTry fetching a resource first.';
    return;
  }

  const lines = resources.map((r) => {
    const cached = r.transferSize === 0 && r.decodedBodySize > 0;
    return [
      `📦 ${r.initiatorType.padEnd(8)} | ${r.duration.toFixed(1).padStart(8)} ms`,
      `   ${cached ? '🟢 CACHE ' : '🔴 NETWORK'} | ${r.transferSize} bytes`,
      `   ${r.name.slice(-80)}`,
    ].join('\n');
  });

  output.textContent = lines.join('\n\n');
});

document.getElementById('btn-fetch-resource').addEventListener('click', async () => {
  const output = document.getElementById('resource-output');
  output.textContent = 'Fetching https://jsonplaceholder.typicode.com/posts/1 …';

  try {
    const t0       = performance.now();
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data     = await response.json();
    const duration = (performance.now() - t0).toFixed(1);

    output.textContent =
      `Fetched in ${duration} ms\n\n` +
      JSON.stringify(data, null, 2) +
      '\n\nClick "List Resources" to see the timing entry.';
  } catch (err) {
    output.textContent = `Fetch failed: ${err.message}`;
  }
});

// ─── 3. User Timing ───────────────────────────────────────────────────────────
document.getElementById('btn-run-measured').addEventListener('click', async () => {
  const output = document.getElementById('user-timing-output');

  // Clear previous
  performance.clearMarks();
  performance.clearMeasures();

  // Mark start
  performance.mark('operation-start');
  output.textContent = 'Running operation…';

  // Simulate async operation (fetch + DOM update)
  performance.mark('fetch-start');
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1').catch(() => null);
  performance.mark('fetch-end');
  performance.measure('fetch-duration', 'fetch-start', 'fetch-end');

  // Simulate a CPU task
  performance.mark('cpu-start');
  let sum = 0;
  for (let i = 0; i < 1_000_000; i++) sum += i;
  performance.mark('cpu-end');
  performance.measure('cpu-duration', 'cpu-start', 'cpu-end');

  // Mark overall end
  performance.mark('operation-end');
  performance.measure('total-duration', 'operation-start', 'operation-end');

  // Read measures
  const measures = performance.getEntriesByType('measure');
  const lines    = measures.map(
    (m) => `📏 ${m.name.padEnd(22)} → ${m.duration.toFixed(2)} ms`
  );

  output.textContent = ['=== User Timing Measures ===', ...lines, `\nsum = ${sum}`].join('\n');
});

document.getElementById('btn-clear-marks').addEventListener('click', () => {
  performance.clearMarks();
  performance.clearMeasures();
  document.getElementById('user-timing-output').textContent = 'Marks and measures cleared.';
});

// ─── 4. PerformanceObserver ───────────────────────────────────────────────────
const observerLog = 'observer-log';

// Observe navigation, resource, measure entries
const entryObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    let css = 'log-resource';
    if (entry.entryType === 'navigation')  css = 'log-nav';
    if (entry.entryType === 'measure')     css = 'log-measure';
    if (entry.entryType === 'paint')       css = 'log-paint';

    const dur = entry.duration != null ? ` | ${entry.duration.toFixed(1)} ms` : '';
    appendToLog(observerLog, `[${entry.entryType}] ${entry.name}${dur}`, css);
  });
});

try {
  entryObserver.observe({
    entryTypes: ['navigation', 'resource', 'measure', 'paint'],
  });
  appendToLog(observerLog, 'Observer active — watching: navigation, resource, measure, paint');
} catch (e) {
  appendToLog(observerLog, `Observer setup warning: ${e.message}`);
}

// ─── Core Web Vitals ──────────────────────────────────────────────────────────

// LCP — Largest Contentful Paint
try {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lcp     = entries[entries.length - 1];
    appendToLog(
      observerLog,
      `[LCP] ${lcp.startTime.toFixed(0)} ms — element: ${lcp.element?.tagName ?? 'n/a'}`,
      'log-lcp'
    );
  }).observe({ type: 'largest-contentful-paint', buffered: true });
} catch {}

// CLS — Cumulative Layout Shift
let clsScore = 0;
try {
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
        appendToLog(
          observerLog,
          `[CLS] shift value: ${entry.value.toFixed(4)} | cumulative: ${clsScore.toFixed(4)}`,
          'log-lcp'
        );
      }
    });
  }).observe({ type: 'layout-shift', buffered: true });
} catch {}

document.getElementById('btn-clear-obs').addEventListener('click', () => {
  document.getElementById(observerLog).innerHTML = '';
});

// ─── 5. Long Task Detection ───────────────────────────────────────────────────
try {
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      appendToLog(
        'longtask-log',
        `Long task detected: ${entry.duration.toFixed(0)} ms (start: ${entry.startTime.toFixed(0)} ms)`,
        'log-longtask'
      );
    });
  }).observe({ entryTypes: ['longtask'] });
  appendToLog('longtask-log', 'Long task observer active (>50 ms blocks will appear here)');
} catch {
  appendToLog('longtask-log', 'longtask entry type not supported in this browser', 'log-longtask');
}

document.getElementById('btn-long-task').addEventListener('click', () => {
  appendToLog('longtask-log', 'Executing 200ms synchronous block…', 'log-measure');

  // Deliberately block the main thread for ~200ms
  const start = performance.now();
  while (performance.now() - start < 200) {
    // busy-wait — intentional for demonstration only!
  }

  appendToLog('longtask-log', 'Block complete — check above for longtask entry');
});
