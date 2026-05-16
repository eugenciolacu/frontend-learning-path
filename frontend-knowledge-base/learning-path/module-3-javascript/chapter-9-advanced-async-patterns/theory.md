# Chapter 9: Advanced Asynchronous Patterns (Advanced)

## Overview

JavaScript is single-threaded, yet the web demands concurrent behaviour: fetching data, reacting to user events, streaming large files, and maintaining live connections all at once. This chapter dissects how JavaScript achieves this through the Promise internal model, advanced `async/await` orchestration, the Streams API, `AbortController`, and the real-time transport protocols — WebSockets, WebRTC, and Server-Sent Events (SSE).

By the end of this chapter you will be able to:
- Explain exactly what happens inside a Promise (states, microtask queue, resolution)
- Build a spec-compliant minimal Promise from scratch
- Orchestrate complex concurrent workflows safely with `async/await`
- Handle partial failures, cancellation, and back-pressure
- Stream data without buffering entire responses in memory
- Choose the right real-time transport for every use-case

---

## 1. Promises Under the Hood

### 1.1 The Promise State Machine

A Promise is an object that represents the **eventual result** of an asynchronous operation. Internally it is a finite state machine with exactly three states:

```
Pending ──resolve()──► Fulfilled
       ──reject()───► Rejected
```

- A Promise starts in **Pending**.
- Calling `resolve(value)` transitions it to **Fulfilled** — this transition is irreversible.
- Calling `reject(reason)` transitions it to **Rejected** — also irreversible.
- Once settled (fulfilled or rejected), calling `resolve`/`reject` again is a no-op.

```js
const p = new Promise((resolve, reject) => {
  // The executor function runs synchronously
  console.log('executor runs');
  resolve(42);
  resolve(99); // Ignored — already settled
});

p.then(v => console.log('value:', v)); // value: 42
```

### 1.2 Microtask Queue vs. Macrotask Queue

`.then()` / `.catch()` / `.finally()` callbacks are **always asynchronous** — they are scheduled as **microtasks**, not macrotasks (like `setTimeout`). Microtasks run before the next macrotask, immediately after the current synchronous code finishes.

```js
console.log('1 — sync start');

Promise.resolve().then(() => console.log('3 — microtask'));

setTimeout(() => console.log('4 — macrotask'), 0);

console.log('2 — sync end');

// Output:
// 1 — sync start
// 2 — sync end
// 3 — microtask   ← runs before setTimeout
// 4 — macrotask
```

This is why `.then()` handlers never run in the same tick as `resolve()`.

### 1.3 Promise Chaining and Flattening

`.then()` always returns a **new Promise**. If the callback itself returns a Promise, the chain waits for that inner Promise to settle — this is called **assimilation** or flattening.

```js
fetch('/api/user')
  .then(res => res.json())          // returns a Promise<Object>
  .then(user => fetchOrders(user.id)) // returns another Promise
  .then(orders => console.log(orders))
  .catch(err => console.error(err));
```

No matter how many levels deep, the chain stays flat — there are no nested `.then()` pyramids.

### 1.4 Custom Promise Implementation

Understanding Promises at the source-code level is one of the best ways to internalise how they work. Below is a minimal but functionally correct implementation following the [Promises/A+ spec](https://promisesaplus.com/).

```js
// ─────────────────────────────────────────────────
//  Minimal Promises/A+ compliant implementation
// ─────────────────────────────────────────────────

const STATE = Object.freeze({ PENDING: 0, FULFILLED: 1, REJECTED: 2 });

class MyPromise {
  #state = STATE.PENDING;
  #value = undefined;
  #handlers = []; // { onFulfilled, onRejected, resolve, reject }

  constructor(executor) {
    try {
      executor(
        value  => this.#resolve(value),
        reason => this.#reject(reason)
      );
    } catch (err) {
      this.#reject(err);
    }
  }

  // ── Private helpers ──────────────────────────────

  #resolve(value) {
    if (this.#state !== STATE.PENDING) return;

    // If resolved with another thenable, adopt its state
    if (value && typeof value.then === 'function') {
      value.then(
        v => this.#resolve(v),
        r => this.#reject(r)
      );
      return;
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

  #runHandlers() {
    // Schedule all queued handlers as microtasks
    queueMicrotask(() => {
      this.#handlers.forEach(({ onFulfilled, onRejected, resolve, reject }) => {
        try {
          if (this.#state === STATE.FULFILLED) {
            resolve(typeof onFulfilled === 'function'
              ? onFulfilled(this.#value)
              : this.#value);
          } else {
            reject(typeof onRejected === 'function'
              ? onRejected(this.#value)
              : this.#value);
          }
        } catch (err) {
          reject(err);
        }
      });
      this.#handlers = [];
    });
  }

  // ── Public API ───────────────────────────────────

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handler = { onFulfilled, onRejected, resolve, reject };
      if (this.#state === STATE.PENDING) {
        this.#handlers.push(handler);
      } else {
        // Already settled — schedule immediately
        this.#handlers = [handler];
        this.#runHandlers();
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      value  => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
    );
  }

  // ── Static helpers ───────────────────────────────

  static resolve(value) {
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let remaining = promises.length;
      if (remaining === 0) return resolve(results);
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(value => {
          results[i] = value;
          if (--remaining === 0) resolve(results);
        }, reject);
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => MyPromise.resolve(p).then(resolve, reject));
    });
  }
}
```

Key implementation notes:
- **`queueMicrotask`** ensures `.then()` callbacks are always async, even for already-resolved Promises.
- **Thenable detection** (`typeof value.then === 'function'`) enables interoperability with any Promise-like object.
- **Private class fields** (`#`) prevent external state mutation.

---

## 2. Advanced `async/await` Patterns

`async/await` is syntactic sugar over Promises. An `async` function always returns a Promise; `await` suspends the function and resumes it when the awaited Promise settles — without blocking the thread.

### 2.1 Sequential vs. Concurrent Execution

A common mistake is awaiting in a loop when the operations are independent:

```js
// ❌ Sequential — each fetch waits for the previous one (~3 × latency)
async function fetchAllSequential(ids) {
  const results = [];
  for (const id of ids) {
    results.push(await fetchUser(id)); // one at a time
  }
  return results;
}

// ✅ Concurrent — all fetches start simultaneously (~1 × latency)
async function fetchAllConcurrent(ids) {
  return Promise.all(ids.map(id => fetchUser(id)));
}
```

### 2.2 Promise Combinators

ES2020+ ships four Promise combinators for different concurrency needs:

| Combinator | Settles when | Short-circuits on | Use case |
|---|---|---|---|
| `Promise.all(iterable)` | All fulfilled | First rejection | All results required |
| `Promise.allSettled(iterable)` | All settled | Never | Audit all outcomes |
| `Promise.race(iterable)` | First settled | First settlement | Timeout / fastest wins |
| `Promise.any(iterable)` | First fulfilled | All rejected | First success matters |

```js
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id),
]);

// Audit all — never throws
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(9999), // may fail
]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('ok', r.value);
  else console.warn('failed', r.reason);
});

// Race with timeout
const data = await Promise.race([
  fetchData(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
]);

// Any — resolves with the first success
const fastestCDN = await Promise.any([
  fetchFrom('cdn1.example.com'),
  fetchFrom('cdn2.example.com'),
  fetchFrom('cdn3.example.com'),
]);
```

### 2.3 Concurrency Control (Rate Limiting)

`Promise.all` starts everything at once. If you have hundreds of tasks you need a **concurrency limit**:

```js
/**
 * Run async tasks with a max concurrency limit.
 * @param {Array<() => Promise<any>>} tasks  - array of task factory functions
 * @param {number} concurrency               - max simultaneous tasks
 * @returns {Promise<any[]>}
 */
async function runWithConcurrency(tasks, concurrency) {
  const results = [];
  const executing = new Set();

  for (const [index, task] of tasks.entries()) {
    const p = task().then(result => {
      results[index] = result;
      executing.delete(p);
    });
    executing.add(p);

    // When the pool is full, wait for one slot to free
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  // Wait for all remaining tasks
  await Promise.all(executing);
  return results;
}

// Usage — process 100 files but only 5 at a time
const files = Array.from({ length: 100 }, (_, i) => () => uploadFile(`file-${i}`));
const uploaded = await runWithConcurrency(files, 5);
```

### 2.4 Error Boundaries with `async/await`

#### Wrapping Individual Calls

```js
// Utility: never throws — returns [value, null] or [null, error]
async function safeAwait(promise) {
  try {
    return [await promise, null];
  } catch (err) {
    return [null, err];
  }
}

const [user, userErr] = await safeAwait(fetchUser(id));
if (userErr) {
  console.error('Could not load user', userErr);
  return;
}
```

#### Global Unhandled Rejection Handling

```js
// Browser
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Suppress browser console error
});

// Node.js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
```

### 2.5 Async Iteration (`for await...of`)

When an async operation produces **multiple values over time** (e.g. paginated API), async generators and `for await...of` are the ergonomic solution:

```js
// Async generator — produces values lazily
async function* paginateUsers(pageSize = 20) {
  let page = 1;
  while (true) {
    const { users, hasMore } = await fetchUsersPage(page, pageSize);
    yield* users;
    if (!hasMore) break;
    page++;
  }
}

// Consumer
for await (const user of paginateUsers(10)) {
  console.log(user.name);
  if (shouldStop(user)) break; // Clean early exit
}
```

### 2.6 Retry Logic with Exponential Back-off

```js
/**
 * Retry an async operation with exponential back-off.
 * @param {() => Promise<T>} fn     - operation factory
 * @param {number} maxRetries       - maximum attempts
 * @param {number} baseDelayMs      - initial delay in ms
 * @returns {Promise<T>}
 */
async function withRetry(fn, maxRetries = 3, baseDelayMs = 200) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) break;
      const delay = baseDelayMs * 2 ** attempt;
      console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms…`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

// Usage
const data = await withRetry(() => fetchCriticalData(), 4, 300);
```

---

## 3. Streams API

The **Streams API** lets you process data **incrementally** — piece by piece — instead of waiting for an entire resource to load. This is critical for large file uploads, real-time media processing, and progressive rendering.

There are three stream types:

| Type | Direction | Use case |
|---|---|---|
| `ReadableStream` | Source → Consumer | Reading data (network response, file) |
| `WritableStream` | Consumer → Destination | Writing data (file, socket) |
| `TransformStream` | Input → Transform → Output | Encoding, compression, parsing |

### 3.1 ReadableStream

The `fetch` API already exposes a `ReadableStream` via `response.body`:

```js
const response = await fetch('/api/large-dataset');
const reader = response.body.getReader();
const decoder = new TextDecoder();

let totalBytes = 0;
while (true) {
  const { done, value } = await reader.read(); // value is Uint8Array
  if (done) break;
  totalBytes += value.byteLength;
  console.log(`Received chunk: ${value.byteLength} bytes (total: ${totalBytes})`);
  processChunk(decoder.decode(value, { stream: true }));
}
```

You can also create a custom `ReadableStream`:

```js
const countStream = new ReadableStream({
  start(controller) {
    let count = 0;
    const interval = setInterval(() => {
      if (count >= 5) {
        controller.close();
        clearInterval(interval);
        return;
      }
      controller.enqueue(count++); // Push a chunk downstream
    }, 500);
  }
});

const reader = countStream.getReader();
for await (const value of countStream) { // Streams are async-iterable
  console.log('chunk:', value); // 0, 1, 2, 3, 4
}
```

### 3.2 TransformStream

A `TransformStream` sits between a readable and a writable, transforming each chunk:

```js
// Transform: uppercase every text chunk
const uppercaseTransform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  }
});

// Pipe: source ──► uppercase ──► destination
const response = await fetch('/api/text-data');
const textStream = response.body
  .pipeThrough(new TextDecoderStream())     // Uint8Array → string
  .pipeThrough(uppercaseTransform);         // string → UPPERCASE string

for await (const chunk of textStream) {
  console.log(chunk);
}
```

### 3.3 WritableStream

```js
const logSink = new WritableStream({
  write(chunk) {
    console.log('Writing chunk:', chunk);
  },
  close() {
    console.log('Stream closed');
  },
  abort(reason) {
    console.error('Stream aborted:', reason);
  }
});

const writer = logSink.getWriter();
await writer.write('Hello');
await writer.write('World');
await writer.close();
```

### 3.4 Piping Streams

The real power of streams comes from **piping** — connecting them into a pipeline:

```js
// Download, decompress, and parse a gzipped JSON stream
const response = await fetch('/data/large-file.json.gz');
await response.body
  .pipeThrough(new DecompressionStream('gzip'))
  .pipeThrough(new TextDecoderStream())
  .pipeTo(new WritableStream({
    write(chunk) {
      processTextChunk(chunk);
    }
  }));
```

### 3.5 Back-pressure

Back-pressure prevents a fast producer from overwhelming a slow consumer. The Streams API handles this automatically via the **internal queue** and `desiredSize`:

```js
const readable = new ReadableStream({
  async pull(controller) {
    // `pull` is called only when the consumer is ready for more data
    const chunk = await getNextChunk();
    if (chunk === null) {
      controller.close();
    } else {
      controller.enqueue(chunk);
    }
  }
});
```

---

## 4. AbortController

`AbortController` provides a standard mechanism to **cancel** async operations — fetch requests, streams, or any custom async task.

### 4.1 Basic Usage

```js
const controller = new AbortController();
const { signal } = controller;

// Start a fetch with the signal
fetch('/api/slow-endpoint', { signal })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch was cancelled');
    } else {
      console.error('Fetch failed:', err);
    }
  });

// Cancel the fetch after 3 seconds
setTimeout(() => controller.abort(), 3000);
```

### 4.2 Cancelling with a Timeout (AbortSignal.timeout)

```js
// Native timeout signal — no manual setTimeout needed
try {
  const response = await fetch('/api/data', {
    signal: AbortSignal.timeout(5000), // Abort after 5 s
  });
  const data = await response.json();
} catch (err) {
  if (err.name === 'TimeoutError') {
    console.error('Request timed out');
  }
}
```

### 4.3 Combining Multiple Signals

```js
// Abort when either a user cancels OR a timeout fires
const userController = new AbortController();
const combined = AbortSignal.any([
  userController.signal,
  AbortSignal.timeout(10_000),
]);

fetch('/api/data', { signal: combined });

// User clicks cancel button
cancelBtn.addEventListener('click', () => userController.abort());
```

### 4.4 Using AbortSignal in Custom Async Operations

```js
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}

const controller = new AbortController();
try {
  await delay(5000, controller.signal);
  console.log('Delay complete');
} catch (err) {
  if (err.name === 'AbortError') console.log('Delay cancelled');
}
controller.abort(); // Cancel early
```

### 4.5 Cancellation in Streams

```js
const controller = new AbortController();

fetch('/api/stream', { signal: controller.signal })
  .then(response => {
    const reader = response.body.getReader();

    controller.signal.addEventListener('abort', () => {
      reader.cancel(); // Cancels the stream read
    });

    return pump(reader);
  });
```

---

## 5. WebSockets

HTTP is a request-response protocol — the client always initiates. **WebSockets** provide a **full-duplex, persistent** TCP connection where both sides can send messages at any time. They are ideal for chat apps, collaborative tools, live dashboards, and multiplayer games.

### 5.1 WebSocket Lifecycle

```
Client                             Server
  │── HTTP Upgrade Request ──────► │
  │◄── 101 Switching Protocols ─── │
  │                                │
  │◄═══════ Full-duplex channel ══►│
  │── send("Hello") ─────────────► │
  │◄── message("Hi back!") ─────── │
  │── close() ───────────────────► │
  │◄── close frame ────────────────│
```

### 5.2 Basic WebSocket Client

```js
const ws = new WebSocket('wss://echo.websocket.org');

// Connection established
ws.addEventListener('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'greeting', payload: 'Hello!' }));
});

// Message received
ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
});

// Connection closed
ws.addEventListener('close', event => {
  console.log(`Closed: code=${event.code}, reason=${event.reason}`);
});

// Error
ws.addEventListener('error', err => {
  console.error('WebSocket error', err);
});

// Send different data types
ws.send('plain text');
ws.send(JSON.stringify({ action: 'subscribe', channel: 'news' }));
ws.send(new Uint8Array([1, 2, 3])); // Binary data

// Close gracefully
ws.close(1000, 'Normal closure');
```

### 5.3 WebSocket Ready States

| `readyState` | Constant | Meaning |
|---|---|---|
| `0` | `WebSocket.CONNECTING` | Connection not yet established |
| `1` | `WebSocket.OPEN` | Connection open and ready to send |
| `2` | `WebSocket.CLOSING` | Close handshake in progress |
| `3` | `WebSocket.CLOSED` | Connection closed or failed to open |

```js
function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(typeof data === 'string' ? data : JSON.stringify(data));
  } else {
    console.warn('Cannot send — socket is not open');
  }
}
```

### 5.4 Automatic Reconnection

A production WebSocket client must handle disconnections gracefully:

```js
class ReconnectingWebSocket {
  #url;
  #ws = null;
  #retryDelay = 1000;
  #maxRetryDelay = 30_000;
  #listeners = new Map();

  constructor(url) {
    this.#url = url;
    this.#connect();
  }

  #connect() {
    this.#ws = new WebSocket(this.#url);

    this.#ws.addEventListener('open', () => {
      console.log('WebSocket connected');
      this.#retryDelay = 1000; // Reset delay on success
      this.#emit('open');
    });

    this.#ws.addEventListener('message', event => {
      this.#emit('message', event);
    });

    this.#ws.addEventListener('close', event => {
      if (!event.wasClean) {
        console.warn(`Disconnected. Reconnecting in ${this.#retryDelay}ms…`);
        setTimeout(() => this.#connect(), this.#retryDelay);
        this.#retryDelay = Math.min(this.#retryDelay * 2, this.#maxRetryDelay);
      }
    });

    this.#ws.addEventListener('error', err => this.#emit('error', err));
  }

  send(data) {
    if (this.#ws?.readyState === WebSocket.OPEN) {
      this.#ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(handler);
  }

  #emit(event, data) {
    this.#listeners.get(event)?.forEach(fn => fn(data));
  }

  close() {
    this.#ws?.close(1000, 'Normal closure');
  }
}

const socket = new ReconnectingWebSocket('wss://example.com/ws');
socket.on('message', event => console.log(JSON.parse(event.data)));
socket.send({ type: 'ping' });
```

### 5.5 WebSocket Sub-protocols

You can negotiate an application-level sub-protocol during the handshake:

```js
// Request specific sub-protocols (server must agree to one)
const ws = new WebSocket('wss://api.example.com/chat', ['v1.chat', 'v2.chat']);

ws.addEventListener('open', () => {
  console.log('Agreed protocol:', ws.protocol); // e.g. 'v2.chat'
});
```

---

## 6. WebRTC

**WebRTC (Web Real-Time Communication)** enables direct **peer-to-peer** audio, video, and data transmission between browsers — no server relay required for the media itself. It is used by video conferencing apps (Google Meet, Discord), file sharing, and multiplayer games.

### 6.1 The Three Core APIs

| API | Purpose |
|---|---|
| `RTCPeerConnection` | Manages the P2P connection, ICE candidates, codecs |
| `MediaStream` / `getUserMedia` | Captures camera and microphone |
| `RTCDataChannel` | Arbitrary binary/text data transfer over the P2P link |

### 6.2 The Signalling Process (Offer/Answer/ICE)

WebRTC uses a **signalling server** (typically WebSocket) only to exchange metadata — the actual media flows peer-to-peer.

```
Peer A                   Signalling Server               Peer B
  │── createOffer() ──────────────────────────────────────►│
  │◄─ createAnswer() ────────────────────────────────────  │
  │── ICE candidates ─────────────────────────────────────►│
  │◄─ ICE candidates ───────────────────────────────────   │
  │                                                        │
  │◄══════════════ Direct P2P channel ══════════════════►  │
```

### 6.3 Setting Up a Peer Connection

```js
// Shared STUN/TURN configuration (helps peers discover their public IPs)
const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, // Free Google STUN
  ]
};

// ── Caller side ─────────────────────────────────────────

async function startCall(signalingChannel) {
  const peerConnection = new RTCPeerConnection(config);

  // Get local camera/mic stream and add tracks
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localStream.getTracks().forEach(track =>
    peerConnection.addTrack(track, localStream)
  );

  // When ICE candidates are discovered, send them via signalling
  peerConnection.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) signalingChannel.send({ type: 'ice-candidate', candidate });
  });

  // Create and send offer
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  signalingChannel.send({ type: 'offer', sdp: offer });

  // Handle incoming answer from callee
  signalingChannel.on('answer', async ({ sdp }) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
  });

  // Handle remote ICE candidates
  signalingChannel.on('ice-candidate', async ({ candidate }) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });

  // Display remote stream when tracks arrive
  peerConnection.addEventListener('track', event => {
    const [remoteStream] = event.streams;
    document.getElementById('remote-video').srcObject = remoteStream;
  });

  return peerConnection;
}
```

### 6.4 RTCDataChannel — P2P Data Transfer

```js
// Create a data channel on the caller's side (before the offer)
const dataChannel = peerConnection.createDataChannel('chat', {
  ordered: true,  // Guarantee delivery order
  // maxRetransmits: 3 — for unreliable channels (games)
});

dataChannel.addEventListener('open', () => {
  console.log('Data channel open');
  dataChannel.send('Hello, peer!');
});

dataChannel.addEventListener('message', event => {
  console.log('Received:', event.data);
});

// On the callee's side, listen for incoming channels
peerConnection.addEventListener('datachannel', event => {
  const channel = event.channel;
  channel.addEventListener('message', e => console.log('Callee received:', e.data));
});
```

### 6.5 WebRTC vs. WebSocket — When to Use Which

| Criterion | WebSocket | WebRTC |
|---|---|---|
| Architecture | Client ↔ Server | Peer ↔ Peer (direct) |
| Latency | Low (~50–150 ms) | Very low (<50 ms P2P) |
| Media (audio/video) | No | Yes (built-in) |
| Data channels | Via server | Direct, low-latency |
| NAT traversal | Not needed | Requires ICE/STUN/TURN |
| Complexity | Low | High |
| Best for | Chat, notifications, dashboards | Video calls, games, P2P file transfer |

---

## 7. Server-Sent Events (SSE)

**Server-Sent Events** is a simple HTTP-based mechanism where the server pushes updates to the client over a **single, long-lived HTTP connection**. Unlike WebSockets, SSE is **one-directional** (server → client only) and works over plain HTTP/1.1.

### 7.1 SSE vs. WebSocket vs. Polling

| Feature | SSE | WebSocket | Long Polling |
|---|---|---|---|
| Direction | Server → Client | Bidirectional | Server → Client |
| Protocol | HTTP | TCP upgrade | HTTP |
| Auto-reconnect | Built-in | Manual | Manual |
| Binary support | No (text/UTF-8) | Yes | Yes |
| Firewall-friendly | Yes (HTTP) | Sometimes (wss) | Yes |
| Best for | Notifications, feeds, live scores | Chat, games | Legacy systems |

### 7.2 Server Side (Node.js Example)

```js
// Express.js SSE endpoint
app.get('/api/events', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Send headers immediately

  let counter = 0;

  const interval = setInterval(() => {
    // SSE format: "data: <payload>\n\n"
    const event = {
      id: ++counter,
      timestamp: new Date().toISOString(),
      value: Math.random().toFixed(4),
    };

    // Named event type (optional)
    res.write(`event: stock-update\n`);
    res.write(`id: ${event.id}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`); // double newline ends the event
  }, 1000);

  // Cleanup when client disconnects
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
```

### 7.3 Client Side — `EventSource`

The browser's built-in `EventSource` API handles SSE connections, including **automatic reconnection**:

```js
const eventSource = new EventSource('/api/events', {
  withCredentials: true, // Send cookies for authenticated streams
});

// Default 'message' event (no event: field in response)
eventSource.addEventListener('message', event => {
  console.log('Message:', event.data);
});

// Named event type
eventSource.addEventListener('stock-update', event => {
  const data = JSON.parse(event.data);
  console.log(`Stock update #${data.id}:`, data.value);
  updateUI(data);
});

// Connection opened
eventSource.addEventListener('open', () => {
  console.log('SSE connection established');
});

// Error handling
eventSource.addEventListener('error', event => {
  if (event.target.readyState === EventSource.CLOSED) {
    console.log('SSE connection closed');
  } else {
    console.warn('SSE error — will retry automatically');
  }
});

// Close the connection manually
function stopListening() {
  eventSource.close();
}
```

### 7.4 SSE Message Format

```
# Comment line (ignored by client)
: heartbeat

# Event with ID and type
id: 42
event: notification
data: {"message":"New comment on your post"}

# Multi-line data (all data: lines are concatenated with \n)
data: {"part1": "Hello,
data:  World"}

# Retry interval (ms) — overrides client default reconnect delay
retry: 3000
```

### 7.5 Authentication with SSE

Since `EventSource` does not support custom HTTP headers, authentication is typically handled via:

1. **Cookies** (set `withCredentials: true`)
2. **Token in URL** (use HTTPS, avoid logging the URL)
3. **First-message handshake** (server sends a challenge, client sends token via separate `fetch`)

```js
// Option 2 — token in query string (HTTPS only!)
const token = getAuthToken();
const es = new EventSource(`/api/events?token=${token}`);

// Server validates req.query.token and rejects with 401 if invalid
```

---

## 8. Putting It All Together — Real-World Architecture

### 8.1 Live Data Dashboard Pattern

```
┌───────────────────────────────────────────────────┐
│ Browser                                           │
│  ┌──────────────┐   SSE    ┌──────────────────┐   │
│  │ EventSource  │◄─────────│ /api/live-data   │   │
│  └──────┬───────┘          └──────────────────┘   │
│         │ event                                   │
│  ┌──────▼───────┐                                 │
│  │ UI Update    │                                 │
│  └──────────────┘                                 │
│                                                   │
│  ┌──────────────┐  WS send  ┌──────────────────┐  │
│  │  WebSocket   │──────────►│ /ws/commands     │  │
│  └──────────────┘           └──────────────────┘  │
└───────────────────────────────────────────────────┘
```

A common pattern: SSE for server-push updates (read), WebSocket for user commands (write). This is simpler than a full bidirectional WebSocket and SSE is more firewall-friendly.

### 8.2 Progressive File Upload with Streams and AbortController

```js
async function uploadLargeFile(file, onProgress) {
  const controller = new AbortController();

  // Expose cancel to the UI
  document.getElementById('cancel-btn').onclick = () => controller.abort();

  const stream = file.stream(); // ReadableStream<Uint8Array>
  let uploaded = 0;

  const progressStream = new TransformStream({
    transform(chunk, ctrl) {
      uploaded += chunk.byteLength;
      onProgress(uploaded / file.size);
      ctrl.enqueue(chunk);
    }
  });

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: stream.pipeThrough(progressStream),
      signal: controller.signal,
      // duplex is required when streaming the body in Chromium
      duplex: 'half',
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Upload cancelled by user');
    }
    throw err;
  }
}
```

---

## Summary

| Topic | Key Concept | When to Use |
|---|---|---|
| Promise internals | State machine + microtask queue | Understanding execution order, debugging |
| Custom Promise | `#resolve`, `#reject`, `queueMicrotask` | Interviews, framework authoring |
| Concurrency control | `Promise.all` + pool size | Batch processing, rate-limited APIs |
| Error boundaries | `safeAwait`, `unhandledRejection` | Resilient production code |
| Async iteration | `async function*`, `for await...of` | Paginated APIs, lazy data pipelines |
| Retry with back-off | Exponential delay | Network reliability |
| Streams API | Chunked processing, piping | Large file I/O, media, progressive responses |
| AbortController | Signal-based cancellation | Fetch, streams, custom async tasks |
| WebSocket | Full-duplex, persistent | Chat, games, live dashboards |
| WebRTC | Peer-to-peer media/data | Video calls, file sharing |
| SSE | Server push, auto-reconnect | Notifications, live feeds |

---

## Further Reading

- [MDN — Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN — Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN — WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MDN — WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [MDN — Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Promises/A+ Specification](https://promisesaplus.com/)
- [web.dev — Streams API guide](https://web.dev/streams/)
- [High Performance Browser Networking — WebRTC chapter](https://hpbn.co/webrtc/)
