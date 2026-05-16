# Chapter 11: Browser Capabilities & Performance (Advanced)

## Overview

Modern browsers expose a rich set of APIs that go far beyond rendering HTML and executing JavaScript on the main thread. This chapter explores how to harness those capabilities to build fast, resilient, and capable web applications.

Four major topic areas are covered:

1. **Web Workers & Service Workers** — Moving work off the main thread and building offline-capable apps
2. **IndexedDB & Client-Side Storage Architecture** — Persisting structured data in the browser
3. **Performance APIs** — Measuring and understanding real-world page performance
4. **Event Management** — Debounce, throttle, passive listeners, and event delegation

---

## 1. Web Workers & Service Workers

### 1.1 Why Threads Matter in the Browser

JavaScript runs on a **single main thread**. The same thread paints the UI, processes user input, and executes your code. A long-running computation (sorting 100k records, parsing XML, image filtering) **freezes the UI** because nothing else can run while that code executes.

The browser gives you two escape hatches:

| Concept | Runs in | Purpose |
|---|---|---|
| **Web Worker** | Dedicated background thread | CPU-intensive computation |
| **Service Worker** | Shared background thread (persistent) | Network proxy, caching, push, background sync |

---

### 1.2 Web Workers

A **Web Worker** is a script that runs in a separate thread. It cannot touch the DOM but it can do almost anything else: math, parsing, data transformation, cryptography.

#### Creating a Worker

```js
// main.js
const worker = new Worker('worker.js');

// Send data to the worker
worker.postMessage({ numbers: [1, 2, 3, 4, 5] });

// Receive results
worker.onmessage = (event) => {
  console.log('Result from worker:', event.data.sum);
};

worker.onerror = (err) => {
  console.error('Worker error:', err.message);
};
```

```js
// worker.js  — runs in background thread
self.onmessage = (event) => {
  const { numbers } = event.data;

  // Simulate CPU-intensive work
  const sum = numbers.reduce((acc, n) => acc + n, 0);

  self.postMessage({ sum });
};
```

#### Transferable Objects

By default, data sent via `postMessage` is **copied** (structured clone). For large binary data (ArrayBuffer, ImageBitmap), you can **transfer** ownership to avoid the copy cost:

```js
const buffer = new ArrayBuffer(1024 * 1024 * 32); // 32 MB

// Transfer instead of clone — buffer is no longer usable in main thread
worker.postMessage({ buffer }, [buffer]);
```

#### Inline Workers (no separate file needed)

```js
const workerCode = `
  self.onmessage = (event) => {
    const result = event.data.map(n => n * 2);
    self.postMessage(result);
  };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);
```

#### When to use Web Workers

- Parsing large JSON / CSV / XML files
- Image and audio processing
- Cryptographic operations (hashing, encryption)
- Physics simulations or game logic
- Real-time data transformation (financial charts, sensor feeds)

---

### 1.3 Service Workers

A **Service Worker** is a programmable network proxy that sits between your web app and the network. Unlike Web Workers, they:

- Persist beyond the page lifetime
- Can intercept and modify HTTP requests/responses
- Can receive push notifications
- Enable offline functionality (Progressive Web Apps)

#### Service Worker Lifecycle

```
Register → Download → Install → Activate → Idle → Fetch/Message/Push events
```

```js
// main.js — register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration.scope);
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  });
}
```

```js
// sw.js — service worker script
const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = ['/', '/index.html', '/styles.css', '/app.js'];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of all open pages
});

// Fetch: intercept network requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

#### Common Caching Strategies

| Strategy | Description | Best for |
|---|---|---|
| **Cache First** | Serve from cache; fall back to network | Static assets (CSS, fonts, images) |
| **Network First** | Try network first; fall back to cache | Dynamic API responses |
| **Stale-While-Revalidate** | Serve from cache, update cache in background | News feeds, avatars |
| **Cache Only** | Always serve from cache | Fully offline apps |
| **Network Only** | Always use network | Analytics, real-time data |

```js
// Network First strategy example
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
```

#### Communication: Service Worker ↔ Page

```js
// main.js — send message to active service worker
navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });

// main.js — receive message from service worker
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('Message from SW:', event.data);
});
```

```js
// sw.js — broadcast to all clients
self.clients.matchAll().then((clients) => {
  clients.forEach((client) => client.postMessage({ type: 'CACHE_UPDATED' }));
});
```

---

## 2. IndexedDB & Client-Side Storage Architecture

### 2.1 Storage Options Compared

| API | Capacity | Sync/Async | Structured data | Persistence |
|---|---|---|---|---|
| **Cookies** | ~4 KB | Sync | No | Session or expiry |
| **localStorage** | ~5–10 MB | Sync (blocking!) | No (string only) | Until cleared |
| **sessionStorage** | ~5–10 MB | Sync | No | Tab session |
| **IndexedDB** | Hundreds of MB+ | Async | Yes (objects, blobs) | Until cleared |
| **Cache API** | Large (quota-based) | Async | Request/Response pairs | Until cleared |

**Rule of thumb:**
- Small, simple key-value data that survives page reloads → `localStorage`
- Structured, queryable data → `IndexedDB`
- Network response caching → `Cache API` (via Service Worker)

### 2.2 IndexedDB Concepts

| Concept | Description |
|---|---|
| **Database** | Named, versioned container |
| **Object Store** | Like a table; stores JavaScript objects |
| **Index** | Secondary lookup path on an object store |
| **Transaction** | All reads/writes happen inside a transaction |
| **Cursor** | Iterate over records in a store or index |
| **Key Path** | Property used as primary key |

### 2.3 Opening a Database

```js
function openDatabase(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    // Runs when database is created or version changes
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('contacts')) {
        const store = db.createObjectStore('contacts', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('email', 'email', { unique: true });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
```

### 2.4 CRUD Operations

```js
// CREATE — add a record
function addContact(db, contact) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    const request = store.add(contact);
    request.onsuccess = () => resolve(request.result); // returns generated key
    request.onerror = () => reject(request.error);
  });
}

// READ — get by primary key
function getContact(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readonly');
    const store = tx.objectStore('contacts');
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// READ — get by index
function getContactByEmail(db, email) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readonly');
    const index = tx.objectStore('contacts').index('email');
    const request = index.get(email);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// UPDATE — put replaces an existing record (or creates if key not found)
function updateContact(db, contact) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    const request = store.put(contact);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// DELETE
function deleteContact(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
```

### 2.5 Iterating with a Cursor

```js
function getAllContacts(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readonly');
    const store = tx.objectStore('contacts');
    const results = [];

    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue(); // advance to next record
      } else {
        resolve(results); // no more records
      }
    };
  });
}
```

### 2.6 Practical Patterns

```js
// Using IndexedDB as an offline data sync buffer
async function saveForSync(db, payload) {
  await addContact(db, { ...payload, syncStatus: 'pending' });
}

// When connectivity is restored, flush pending records
async function syncPending(db) {
  const all = await getAllContacts(db);
  const pending = all.filter((c) => c.syncStatus === 'pending');

  for (const record of pending) {
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      await updateContact(db, { ...record, syncStatus: 'synced' });
    } catch {
      // Stay pending; retry on next connectivity event
    }
  }
}
```

> **Library tip:** For production apps, consider [Dexie.js](https://dexie.org/) — a lightweight IndexedDB wrapper with a clean Promise/async API and query support.

---

## 3. Performance APIs

### 3.1 Why Measure Performance?

User perception of speed directly affects conversion rates and satisfaction. The browser provides APIs to:

- Measure real-world page load timings
- Track resource loading costs
- Observe long tasks that block the main thread
- Capture Core Web Vitals programmatically

### 3.2 Navigation Timing API

The **Navigation Timing API** exposes the full timeline of a page load — from navigation start through DOM interactive to load complete.

```js
// Access the navigation performance entry
const [navEntry] = performance.getEntriesByType('navigation');

console.log('DNS lookup:',        navEntry.domainLookupEnd - navEntry.domainLookupStart, 'ms');
console.log('TCP connect:',       navEntry.connectEnd - navEntry.connectStart, 'ms');
console.log('TTFB:',              navEntry.responseStart - navEntry.requestStart, 'ms');
console.log('Response download:', navEntry.responseEnd - navEntry.responseStart, 'ms');
console.log('DOM parsing:',       navEntry.domContentLoadedEventEnd - navEntry.responseEnd, 'ms');
console.log('Total load time:',   navEntry.loadEventEnd - navEntry.startTime, 'ms');
```

#### Key Navigation Timing Milestones

```
navigationStart
  ├── redirectStart / redirectEnd       (HTTP redirects)
  ├── fetchStart                         (DNS, TCP, TLS begin)
  ├── domainLookupStart/End              (DNS resolution)
  ├── connectStart/End                   (TCP handshake)
  ├── secureConnectionStart              (TLS handshake start)
  ├── requestStart                       (first byte sent to server)
  ├── responseStart                      (TTFB — first byte received)
  ├── responseEnd                        (last byte received)
  ├── domInteractive                     (HTML parsed, deferred JS runs)
  ├── domContentLoadedEventStart/End     (DOMContentLoaded event)
  └── loadEventStart/End                 (window.load event)
```

### 3.3 Resource Timing API

Tracks the loading timeline of every resource (scripts, images, fonts, XHR/fetch).

```js
// Get all resource timings
const resources = performance.getEntriesByType('resource');

resources.forEach((r) => {
  console.log(`${r.name}`);
  console.log(`  Duration: ${r.duration.toFixed(2)} ms`);
  console.log(`  Transfer size: ${r.transferSize} bytes`);
  console.log(`  Cache: ${r.transferSize === 0 ? 'HIT' : 'MISS'}`);
});

// Filter slow resources
const slow = resources.filter((r) => r.duration > 500);
console.log('Slow resources:', slow.map((r) => r.name));
```

```js
// Clear buffered entries to avoid memory growth
performance.clearResourceTimings();

// Increase buffer size (default 150)
performance.setResourceTimingBufferSize(500);
```

### 3.4 User Timing API

Mark and measure custom application milestones using named timestamps.

```js
// Mark the start of a critical operation
performance.mark('data-fetch-start');

const data = await fetch('/api/data').then((r) => r.json());

// Mark the end
performance.mark('data-fetch-end');

// Create a named measure between two marks
performance.measure('data-fetch-duration', 'data-fetch-start', 'data-fetch-end');

// Read the measurement
const [measure] = performance.getEntriesByName('data-fetch-duration');
console.log(`Data fetch took ${measure.duration.toFixed(2)} ms`);

// Cleanup
performance.clearMarks();
performance.clearMeasures();
```

### 3.5 PerformanceObserver

`PerformanceObserver` lets you **react to performance entries as they occur** — no polling required.

```js
// Observe all supported entry types
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`[${entry.entryType}] ${entry.name}: ${entry.duration?.toFixed(2)} ms`);
  }
});

observer.observe({
  entryTypes: ['navigation', 'resource', 'measure', 'longtask', 'paint'],
});
```

#### Observing Long Tasks

A **Long Task** is any task that blocks the main thread for more than 50 ms. They directly cause janky animations and unresponsive input.

```js
const longTaskObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.warn(
      `Long task detected: ${entry.duration.toFixed(0)} ms`,
      entry.attribution
    );
  });
});

longTaskObserver.observe({ entryTypes: ['longtask'] });
```

#### Observing Core Web Vitals

```js
// Largest Contentful Paint (LCP) — loading performance
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lcp = entries[entries.length - 1]; // use last reported value
  console.log('LCP:', lcp.startTime.toFixed(0), 'ms', lcp.element);
}).observe({ type: 'largest-contentful-paint', buffered: true });

// Cumulative Layout Shift (CLS) — visual stability
let clsScore = 0;
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
    }
  });
  console.log('CLS score so far:', clsScore.toFixed(4));
}).observe({ type: 'layout-shift', buffered: true });

// Interaction to Next Paint (INP) — responsiveness (replaces FID)
new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('Interaction duration:', entry.duration, 'ms', entry.name);
  });
}).observe({ type: 'event', buffered: true, durationThreshold: 16 });
```

### 3.6 Core Web Vitals Reference

| Metric | Measures | Good | Needs Improvement | Poor |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Loading speed | ≤ 2.5s | ≤ 4s | > 4s |
| **INP** (Interaction to Next Paint) | Responsiveness | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | ≤ 0.1 | ≤ 0.25 | > 0.25 |

---

## 4. Event Management

### 4.1 The Problem with Naive Event Listeners

Some events fire **extremely frequently**: `scroll`, `resize`, `mousemove`, `keydown`, `input`. Attaching expensive callbacks directly to these events causes **main-thread congestion** and dropped frames.

```js
// ❌ BAD — fires on every pixel scrolled, blocks scroll thread
window.addEventListener('scroll', () => {
  recalculateLayout(); // heavy DOM operation
});
```

### 4.2 Debounce

**Debounce** delays executing a function until the event has **stopped firing** for a specified period. Each new event resets the timer.

**Mental model:** "Wait until the user stops typing, then search."

```
Event:   ──e──e──e──────────e──────────────
Timer:         [T][T][T]────────────[T]────
Execute:                    ↑              ↑
```

```js
function debounce(fn, delay) {
  let timerId = null;

  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Usage
const searchInput = document.getElementById('search');
const handleSearch = debounce((event) => {
  console.log('Searching for:', event.target.value);
  // Only fires 300ms after the user stops typing
}, 300);

searchInput.addEventListener('input', handleSearch);
```

#### Leading-edge debounce (fire immediately, then ignore)

```js
function debounceLeading(fn, delay) {
  let timerId = null;

  return function (...args) {
    if (!timerId) {
      fn.apply(this, args); // fire immediately on first call
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
}
```

### 4.3 Throttle

**Throttle** limits a function to execute **at most once per interval**, regardless of how many times the event fires.

**Mental model:** "Execute at most once every 200 ms no matter how fast the user scrolls."

```
Event:   ──e─e─e─e─e─e─e─e─e─e──
Execute: ──↑───────↑───────↑─────
         (every 200ms interval)
```

```js
function throttle(fn, interval) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  const scrollY = window.scrollY;
  document.getElementById('scroll-pos').textContent = `Scrolled: ${scrollY}px`;
}, 200);

window.addEventListener('scroll', handleScroll);
```

#### requestAnimationFrame-based throttle (best for visual updates)

```js
function rafThrottle(fn) {
  let rafId = null;

  return function (...args) {
    if (rafId) return; // already scheduled
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args);
      rafId = null;
    });
  };
}

// Guaranteed to run at most once per animation frame (~60fps)
window.addEventListener('scroll', rafThrottle(updateParallaxEffect));
```

### 4.4 Debounce vs. Throttle — When to Use Which

| Use Case | Pattern | Reason |
|---|---|---|
| Search autocomplete | Debounce | Fire only after user stops typing |
| Window resize layout recalc | Debounce | Recalculate once after resize ends |
| Scroll-based animations | Throttle (RAF) | Need regular updates while scrolling |
| Button click guard | Debounce (leading) | Fire immediately, ignore rapid clicks |
| Scroll-based sticky header | Throttle | Regular position check during scroll |
| Live form validation | Debounce | Validate after user pauses typing |
| API polling | Throttle | Cap request rate |
| Mouse cursor tracking | Throttle | Limit position updates |

### 4.5 Passive Event Listeners

By default, the browser cannot know whether your `scroll` or `touch` event listener will call `event.preventDefault()`. To be safe, it **waits** for your handler to complete before scrolling — introducing latency and jank.

**Passive listeners** promise the browser you will NOT call `preventDefault()`, allowing the browser to scroll immediately without waiting.

```js
// ❌ Default — browser waits for handler before scrolling
window.addEventListener('scroll', handleScroll);

// ✅ Passive — browser scrolls immediately, handler runs async
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('touchstart', handleTouch, { passive: true });
window.addEventListener('touchmove', handleMove, { passive: true });
```

```js
// Check if passive is supported (older browsers)
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() { supportsPassive = true; }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch {}

const listenerOpts = supportsPassive ? { passive: true } : false;
window.addEventListener('scroll', handleScroll, listenerOpts);
```

> **Note:** If you mark a listener as passive and call `event.preventDefault()`, the browser will ignore the call and log a console warning.

### 4.6 Event Delegation

**Event Delegation** exploits event bubbling: instead of attaching an event listener to **each** child element, you attach **one listener to a common ancestor** and inspect `event.target` to determine which child was clicked.

```
                  ┌──────────────────────┐
User clicks <li>  │ click bubbles up to   │
                  │ <ul> where single     │
                  │ listener lives        │
                  └──────────────────────┘
```

#### Without delegation (❌ inefficient)

```js
// Creates N listeners — one per item
document.querySelectorAll('.todo-item').forEach((item) => {
  item.addEventListener('click', handleItemClick);
});
// Also breaks if items are added dynamically!
```

#### With delegation (✅ efficient)

```js
const list = document.getElementById('todo-list');

list.addEventListener('click', (event) => {
  // Find the closest matching ancestor of the click target
  const item = event.target.closest('.todo-item');
  if (!item) return; // clicked outside items

  const action = event.target.dataset.action;

  if (action === 'delete') {
    item.remove();
  } else if (action === 'complete') {
    item.classList.toggle('completed');
  }
});
```

#### HTML structure that pairs with delegation

```html
<ul id="todo-list">
  <li class="todo-item" data-id="1">
    <span>Buy groceries</span>
    <button data-action="complete">✓</button>
    <button data-action="delete">✕</button>
  </li>
  <li class="todo-item" data-id="2">
    <span>Read a book</span>
    <button data-action="complete">✓</button>
    <button data-action="delete">✕</button>
  </li>
</ul>
```

#### Dynamic content — why delegation shines

```js
// Items added AFTER initial page load are automatically handled
function addTodo(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = Date.now();
  li.innerHTML = `
    <span>${text}</span>
    <button data-action="complete">✓</button>
    <button data-action="delete">✕</button>
  `;
  document.getElementById('todo-list').appendChild(li);
  // No need to attach a new listener — parent delegation handles it
}
```

### 4.7 Removing Event Listeners Properly

Failing to remove listeners is a common source of memory leaks, especially in single-page applications.

```js
// ❌ Anonymous functions cannot be removed
element.addEventListener('click', () => doSomething());
element.removeEventListener('click', () => doSomething()); // Different reference — does nothing!

// ✅ Named reference
const handler = () => doSomething();
element.addEventListener('click', handler);
element.removeEventListener('click', handler); // Correctly removes it
```

```js
// ✅ AbortController — clean up multiple listeners at once
const controller = new AbortController();
const { signal } = controller;

document.addEventListener('keydown', handleKey, { signal });
window.addEventListener('resize', handleResize, { signal });
document.addEventListener('click', handleClick, { signal });

// Remove ALL listeners at once
controller.abort();
```

---

## Summary Table

| Topic | Key API / Pattern | When to Use |
|---|---|---|
| CPU-intensive work off main thread | `new Worker()` | Parsing, cryptography, data processing |
| Offline, caching, PWA | Service Worker + Cache API | Any app that needs reliability |
| Structured client-side data | `indexedDB.open()` | Large/complex data, offline sync |
| Page load timing | `performance.getEntriesByType('navigation')` | Diagnostic metrics, RUM |
| Asset timing | `performance.getEntriesByType('resource')` | Identifying slow third-party scripts |
| Custom app timings | `performance.mark/measure` | Profiling specific code paths |
| React to perf events | `new PerformanceObserver()` | Core Web Vitals, long task detection |
| Delay until user pauses | Debounce | Search inputs, resize callbacks |
| Rate-limit continuous events | Throttle | Scroll handlers, animations |
| Scroll/touch without jank | `{ passive: true }` | Any scroll or touch listener |
| One listener for many children | Event Delegation | Lists, tables, dynamic content |

---

## Further Reading

- [MDN: Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [web.dev: Performance](https://web.dev/performance/)
- [web.dev: Core Web Vitals](https://web.dev/vitals/)
- [MDN: PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [Dexie.js — IndexedDB wrapper](https://dexie.org/)
