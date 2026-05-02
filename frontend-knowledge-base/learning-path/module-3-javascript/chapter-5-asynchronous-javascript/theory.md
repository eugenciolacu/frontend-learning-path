# Chapter 5: Asynchronous JavaScript

## Overview

JavaScript is a **single-threaded** language — it can only execute one piece of code at a time. Yet modern web applications routinely perform tasks like fetching data from a server, reading files, or waiting for a timer, all without freezing the browser tab. Asynchronous programming is the set of tools and patterns that make this possible.

This chapter covers the full evolution of async JavaScript:

1. **Callbacks** — the original pattern, and why it breaks down at scale.
2. **Promises** — a cleaner abstraction introduced in ES2015.
3. **Async/Await** — syntactic sugar over Promises (ES2017) that reads like synchronous code.
4. **Fetch API** — the modern way to make HTTP requests from the browser.
5. **Working with real APIs** — error handling, CORS, and practical patterns.

Understanding how JavaScript handles asynchronous work requires a basic mental model of the **event loop**, which is introduced in the next section.

---

## 1. The JavaScript Event Loop (Mental Model)

Before diving into code, it helps to understand *why* async patterns are needed.

### The single-threaded model

```
Call Stack     Web APIs         Callback Queue   Microtask Queue
──────────     ────────         ──────────────   ───────────────
main()    ──►  setTimeout()
fetch()   ──►  fetch (network)
...            ...         ──►  callback fn  ──► .then() handler
```

- The **call stack** runs synchronous code one frame at a time.
- **Web APIs** (provided by the browser, not JavaScript itself) handle async operations like `setTimeout`, network requests, and DOM events.
- When an async operation finishes, its result is placed on the **callback queue** (macrotasks) or the **microtask queue** (Promises).
- The **event loop** continuously checks: "Is the call stack empty? If so, run the next task from the queue."

> **Key insight:** Async code does not run *in parallel* — it runs *later*, after the current synchronous code finishes. Promises and `await` use the **microtask queue**, which is always flushed before the next macrotask (e.g., `setTimeout` callback). This distinction matters for understanding execution order.

### Execution order example

```js
console.log('1 – synchronous');

setTimeout(() => console.log('4 – setTimeout (macrotask)'), 0);

Promise.resolve().then(() => console.log('3 – Promise microtask'));

console.log('2 – synchronous');

// Output:
// 1 – synchronous
// 2 – synchronous
// 3 – Promise microtask
// 4 – setTimeout (macrotask)
```

---

## 2. Callbacks

A **callback** is simply a function passed as an argument to another function, to be called when a specific event or operation completes.

### Basic callback

```js
function greet(name, callback) {
  console.log('Hello, ' + name);
  callback();
}

function sayGoodbye() {
  console.log('Goodbye!');
}

greet('Alice', sayGoodbye);
// Hello, Alice
// Goodbye!
```

### Async callback with `setTimeout`

```js
console.log('Start');

setTimeout(function () {
  console.log('This runs after 2 seconds');
}, 2000);

console.log('End');

// Output:
// Start
// End
// This runs after 2 seconds
```

The key point: `setTimeout` is non-blocking. The script continues to `console.log('End')` immediately; the callback is invoked later by the event loop.

### Node-style error-first callbacks

Before Promises, Node.js standardised a convention: **the first parameter of every callback is an error** (or `null` if there is none).

```js
function readFile(path, callback) {
  // Simulated async file read
  setTimeout(function () {
    if (!path) {
      callback(new Error('Path is required'));
      return;
    }
    callback(null, 'file contents here');
  }, 500);
}

readFile('./data.txt', function (err, data) {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File data:', data);
});
```

### Callback hell

Callbacks become unwieldy when operations depend on each other, leading to deeply nested code nicknamed **"callback hell"** or the **"pyramid of doom"**:

```js
getUser(userId, function (err, user) {
  if (err) { handleError(err); return; }

  getOrders(user.id, function (err, orders) {
    if (err) { handleError(err); return; }

    getOrderDetails(orders[0].id, function (err, details) {
      if (err) { handleError(err); return; }

      getProduct(details.productId, function (err, product) {
        if (err) { handleError(err); return; }

        console.log('Product:', product.name);
        // ← We are now 5 levels deep
      });
    });
  });
});
```

**Problems with this pattern:**

| Issue | Description |
|---|---|
| Readability | Indentation grows uncontrollably. |
| Error handling | Every level must repeat `if (err)` checks. |
| Inversion of control | You hand execution control over to the called function; you trust it to call your callback correctly, exactly once. |
| Debugging | Stack traces point to anonymous functions with no meaningful context. |

> Promises were designed specifically to solve these problems.

---

## 3. Promises

A **Promise** is an object representing the eventual result (or failure) of an asynchronous operation. It can be in one of three states:

| State | Meaning |
|---|---|
| `pending` | The operation has not finished yet. |
| `fulfilled` | The operation completed successfully — the promise has a **value**. |
| `rejected` | The operation failed — the promise has a **reason** (an Error). |

Once a Promise transitions from `pending` to either `fulfilled` or `rejected`, it is **settled** and its state never changes.

### Creating a Promise

```js
const promise = new Promise(function (resolve, reject) {
  // Async work happens here
  setTimeout(function () {
    const success = true;

    if (success) {
      resolve('Operation succeeded!'); // fulfil with a value
    } else {
      reject(new Error('Operation failed.')); // reject with an error
    }
  }, 1000);
});
```

The constructor receives an **executor function** with two parameters:
- `resolve(value)` — call this when the work succeeds.
- `reject(reason)` — call this when the work fails (conventionally pass an `Error` object).

### Consuming a Promise with `.then()` and `.catch()`

```js
promise
  .then(function (value) {
    console.log('Resolved:', value); // "Operation succeeded!"
  })
  .catch(function (error) {
    console.error('Rejected:', error.message);
  });
```

### `.then()` chaining

Every `.then()` returns a **new Promise**, which allows you to chain operations sequentially without nesting:

```js
fetch('/api/user/1')                          // Promise<Response>
  .then(response => response.json())          // Promise<User>
  .then(user => fetch(`/api/orders/${user.id}`)) // Promise<Response>
  .then(response => response.json())          // Promise<Orders>
  .then(orders => {
    console.log('Orders:', orders);
  })
  .catch(error => {
    // ONE catch handles errors from any step above
    console.error('Something went wrong:', error);
  });
```

> **How chaining works:** if a `.then()` handler returns a value, the next `.then()` receives that value. If it returns a *Promise*, the chain waits for that Promise to settle before continuing.

### `.finally()`

`.finally()` runs regardless of whether the Promise fulfilled or rejected — useful for cleanup (e.g., hiding a loading spinner):

```js
showSpinner();

fetch('/api/data')
  .then(response => response.json())
  .then(data => renderData(data))
  .catch(error => showError(error))
  .finally(() => hideSpinner()); // always runs
```

### Promise error handling in depth

```js
// A rejected promise propagates until a .catch() handles it
Promise.reject(new Error('oops'))
  .then(v => console.log('then 1', v))  // skipped
  .then(v => console.log('then 2', v))  // skipped
  .catch(e => {
    console.error('caught:', e.message); // "caught: oops"
    return 'recovered';                  // return a value to resume the chain
  })
  .then(v => console.log('after catch:', v)); // "after catch: recovered"
```

You can also **throw** inside a `.then()` to trigger the nearest `.catch()`:

```js
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => console.error(error.message));
```

### Static Promise methods

#### `Promise.all()` — all or nothing

Waits for **all** Promises to fulfil. If **any** rejects, the entire call rejects immediately.

```js
const p1 = fetch('/api/users').then(r => r.json());
const p2 = fetch('/api/products').then(r => r.json());
const p3 = fetch('/api/orders').then(r => r.json());

Promise.all([p1, p2, p3])
  .then(([users, products, orders]) => {
    console.log('All loaded:', users, products, orders);
  })
  .catch(error => console.error('One request failed:', error));
```

> Use `Promise.all` to run multiple **independent** async operations concurrently and wait for all of them.

#### `Promise.allSettled()` — wait for all, never short-circuits

Returns an array of result objects, each with a `status` of `"fulfilled"` or `"rejected"`:

```js
Promise.allSettled([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/broken-endpoint').then(r => r.json()),
])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log('Success:', result.value);
      } else {
        console.warn('Failed:', result.reason.message);
      }
    });
  });
```

#### `Promise.race()` — first to settle wins

```js
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timed out')), 5000)
);

Promise.race([fetch('/api/data'), timeout])
  .then(response => response.json())
  .catch(error => console.error(error.message));
```

#### `Promise.any()` — first to *fulfil* wins (ES2021)

Rejects only if **all** Promises reject (with an `AggregateError`):

```js
Promise.any([
  fetch('https://mirror-1.example.com/file'),
  fetch('https://mirror-2.example.com/file'),
  fetch('https://mirror-3.example.com/file'),
])
  .then(response => response.blob())
  .catch(e => console.error('All mirrors failed', e));
```

### Converting callbacks to Promises

Old callback-based APIs can be wrapped in a Promise:

```js
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000).then(() => console.log('1 second passed'));
```

---

## 4. Async / Await

`async`/`await` is syntactic sugar introduced in **ES2017**. It lets you write asynchronous code that *looks* synchronous, making it far easier to read and maintain.

### The `async` keyword

Adding `async` before a function declaration or expression makes it return a Promise automatically:

```js
async function greet() {
  return 'Hello!';
}

greet().then(console.log); // "Hello!"
// Equivalent to: Promise.resolve('Hello!').then(console.log)
```

### The `await` keyword

`await` can only be used **inside an `async` function**. It pauses execution of that function until the Promise settles, then returns the resolved value:

```js
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);  // wait for the Response
  const user = await response.json();                // wait for the JSON parse
  return user;
}

fetchUser(1).then(user => console.log(user.name));
```

Under the hood, `await` is equivalent to `.then()` — both use the microtask queue. No thread is actually "blocked."

### Error handling with `try / catch`

Instead of `.catch()`, use standard `try/catch` blocks:

```js
async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchData failed:', error.message);
    throw error; // re-throw so the caller can also handle it if needed
  }
}
```

### Sequential vs. concurrent execution

**Sequential** (each request waits for the previous one — slower):

```js
async function loadSequentially() {
  const user    = await fetchUser(1);     // waits ~200ms
  const orders  = await fetchOrders(1);  // waits another ~200ms
  return { user, orders };
  // total: ~400ms
}
```

**Concurrent** (kick off all requests at once — faster):

```js
async function loadConcurrently() {
  const [user, orders] = await Promise.all([
    fetchUser(1),
    fetchOrders(1),
  ]);
  return { user, orders };
  // total: ~200ms (limited by the slowest request)
}
```

> **Rule of thumb:** Only use sequential `await` when each operation depends on the result of the previous one. For independent operations, prefer `Promise.all`.

### Async arrow functions

```js
const getProduct = async (id) => {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
};
```

### Async IIFEs (top-level await workaround in older environments)

In environments that do not support top-level `await` (ES Modules at the top level), wrap your code in an immediately-invoked async function:

```js
(async () => {
  const data = await fetchData('/api/stats');
  console.log(data);
})();
```

Modern ES Modules (`.mjs` files or `<script type="module">`) support **top-level `await`** directly:

```js
// In a module — no wrapper needed
const data = await fetchData('/api/stats');
console.log(data);
```

### Common mistakes with async/await

```js
// ❌ WRONG: forEach does not wait for async callbacks
async function processAll(items) {
  items.forEach(async item => {
    await processItem(item); // this runs but is not awaited by forEach
  });
  // processAll resolves before any item is processed!
}

// ✅ CORRECT: use a for...of loop
async function processAll(items) {
  for (const item of items) {
    await processItem(item);
  }
}

// ✅ CORRECT: concurrent processing with Promise.all + map
async function processAll(items) {
  await Promise.all(items.map(item => processItem(item)));
}
```

---

## 5. Fetch API

The **Fetch API** is a modern, Promise-based interface for making HTTP requests from the browser. It replaces the older `XMLHttpRequest` (XHR) API.

### Basic GET request

```js
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(post => console.log(post.title))
  .catch(error => console.error('Network error:', error));
```

### Fetch with async/await

```js
async function getPost(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await response.json();
  console.log(post.title);
}

getPost(1);
```

### Understanding the `Response` object

`fetch()` resolves with a `Response` object as soon as the **headers** are received — even if the status is 404 or 500. You must check `response.ok` (or `response.status`) manually:

```js
async function safeFetch(url) {
  const response = await fetch(url);

  if (!response.ok) {
    // 4xx and 5xx are NOT automatically thrown as errors
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

> **Common mistake:** Calling `fetch()` and only catching network errors (DNS failure, no internet). HTTP errors like 404 or 500 still *resolve* the Promise — you must inspect `response.ok` yourself.

### Reading the response body

The `Response` body can only be read **once**. Choose the method that matches the expected content:

```js
response.json()      // Parses JSON → returns a JS object/array
response.text()      // Returns raw text (HTML, CSV, plain text)
response.blob()      // Returns binary data (images, PDFs)
response.arrayBuffer() // Low-level binary data
response.formData()  // FormData object
```

### POST request with JSON body

```js
async function createPost(postData) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`);
  }

  const newPost = await response.json();
  console.log('Created:', newPost);
  return newPost;
}

createPost({ title: 'Hello World', body: 'My first post', userId: 1 });
```

### PUT and DELETE requests

```js
// PUT – replace a resource
async function updatePost(id, data) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// DELETE – remove a resource
async function deletePost(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
  console.log(`Post ${id} deleted`);
}
```

### Sending query parameters

Use the `URL` constructor to build URLs safely:

```js
async function searchPosts(query) {
  const url = new URL('https://jsonplaceholder.typicode.com/posts');
  url.searchParams.set('userId', 1);
  url.searchParams.set('q', query);

  const response = await fetch(url.toString());
  return response.json();
}
```

### Uploading a file with FormData

```js
async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', '42');

  const response = await fetch('/api/upload', {
    method: 'POST',
    // Do NOT manually set Content-Type when using FormData
    // The browser sets the correct multipart boundary automatically
    body: formData,
  });

  return response.json();
}
```

### Request options reference

```js
fetch(url, {
  method: 'POST',              // 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers: {                   // HTTP headers
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),  // request body (string, FormData, Blob, etc.)
  credentials: 'include',      // send cookies: 'omit' | 'same-origin' | 'include'
  cache: 'no-cache',           // caching strategy
  signal: abortController.signal, // for request cancellation (see below)
});
```

### Cancelling a request with `AbortController`

```js
const controller = new AbortController();

// Cancel after 5 seconds
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('/api/slow-endpoint', {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  const data = await response.json();
  console.log(data);
} catch (error) {
  if (error.name === 'AbortError') {
    console.warn('Request was cancelled');
  } else {
    throw error;
  }
}
```

---

## 6. Working with APIs

### What is a REST API?

A **REST API** is a server-side service that exposes data over HTTP using standard methods:

| Method | Action | Example |
|---|---|---|
| `GET` | Read data | `GET /api/users/1` |
| `POST` | Create data | `POST /api/users` |
| `PUT` / `PATCH` | Update data | `PUT /api/users/1` |
| `DELETE` | Remove data | `DELETE /api/users/1` |

Responses are usually in **JSON** format with an HTTP status code:

| Status code | Meaning |
|---|---|
| 200 OK | Request succeeded |
| 201 Created | Resource created successfully |
| 400 Bad Request | Client sent invalid data |
| 401 Unauthorized | Authentication required |
| 403 Forbidden | Authenticated but not allowed |
| 404 Not Found | Resource does not exist |
| 422 Unprocessable Entity | Validation error |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Something went wrong on the server |

### Robust error handling pattern

```js
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

async function apiFetch(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (networkError) {
    // Network failures: DNS resolution, no internet, CORS preflight blocked
    throw new Error(`Network error: ${networkError.message}`);
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    throw new APIError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Handle 204 No Content (DELETE responses, etc.)
  if (response.status === 204) return null;

  return response.json();
}

// Usage
async function main() {
  try {
    const user = await apiFetch('/api/users/999');
    console.log(user);
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        console.warn('User not found');
      } else if (error.status === 401) {
        redirectToLogin();
      }
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
}
```

### CORS (Cross-Origin Resource Sharing)

**CORS** is a browser security mechanism that restricts web pages from making requests to a different **origin** (protocol + domain + port) than the one that served the page.

```
Origin of the page:    https://myapp.com
Request target:        https://api.example.com   ← different origin → CORS applies
```

#### How CORS works

1. The browser checks the target URL's origin. If it differs, the browser adds an `Origin` header to the request.
2. For "simple" requests (GET/POST with basic headers), the server must respond with `Access-Control-Allow-Origin: *` or `Access-Control-Allow-Origin: https://myapp.com`.
3. For "non-simple" requests (custom headers, PUT/DELETE, `Content-Type: application/json`), the browser sends an **OPTIONS preflight** request first to check permission.

#### From the browser developer console

CORS errors look like:

```
Access to fetch at 'https://api.example.com/data' from origin 'https://myapp.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

#### Solutions

| Situation | Solution |
|---|---|
| You control the API server | Add `Access-Control-Allow-Origin` response headers |
| You don't control the API | Route requests through your own backend (proxy) |
| Development only | Use a dev proxy (Vite's `server.proxy`, webpack `devServer.proxy`) |
| Public APIs | Many public APIs already have CORS enabled |

```js
// Example: Vite dev server proxy config (vite.config.js)
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://api.third-party.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
```

> **Important:** CORS is a **browser** restriction. Direct server-to-server requests (Node.js, Python, etc.) are never subject to CORS.

### Practical patterns when consuming public APIs

#### 1. Use a base URL constant

```js
const BASE_URL = 'https://api.example.com/v1';

async function getUser(id) {
  return apiFetch(`${BASE_URL}/users/${id}`);
}
```

#### 2. Attach authentication headers

```js
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function authenticatedFetch(url, options = {}) {
  return apiFetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
}
```

> **Security note:** Avoid storing tokens in `localStorage` for high-security apps — it is accessible to any JS on the page and vulnerable to XSS. Prefer `HttpOnly` cookies set by the server. For learning projects, `localStorage` is acceptable.

#### 3. Rate limiting and retry logic (basic)

```js
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await apiFetch(url, options);
    } catch (error) {
      const isLast = attempt === retries;
      const isRetryable = error instanceof APIError && error.status >= 500;

      if (isLast || !isRetryable) throw error;

      const delay = 2 ** attempt * 200; // exponential back-off: 400ms, 800ms, ...
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms…`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

#### 4. Loading, data, and error state (UI pattern)

```js
let state = { loading: false, data: null, error: null };

async function loadPosts() {
  state.loading = true;
  state.error = null;
  render();

  try {
    state.data = await apiFetch('https://jsonplaceholder.typicode.com/posts');
  } catch (error) {
    state.error = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  if (state.loading) {
    document.getElementById('app').innerHTML = '<p>Loading…</p>';
  } else if (state.error) {
    document.getElementById('app').innerHTML = `<p class="error">${state.error}</p>`;
  } else {
    document.getElementById('app').innerHTML = state.data
      .map(post => `<article><h2>${post.title}</h2><p>${post.body}</p></article>`)
      .join('');
  }
}
```

### Using public APIs for practice

These free APIs have CORS enabled and require no authentication:

| API | URL | What it provides |
|---|---|---|
| JSONPlaceholder | `https://jsonplaceholder.typicode.com` | Fake posts, users, todos |
| Open-Meteo | `https://api.open-meteo.com` | Weather data |
| The Cat API | `https://api.thecatapi.com` | Cat images |
| PokeAPI | `https://pokeapi.co` | Pokémon data |
| REST Countries | `https://restcountries.com` | Country data |
| Open Library | `https://openlibrary.org` | Books / authors |

---

## Summary

| Concept | When to use |
|---|---|
| **Callbacks** | Simple one-off async events (event listeners, `setTimeout`). Avoid for chained operations. |
| **Promises** | When you need to compose async operations, run them in parallel (`Promise.all`), or race them (`Promise.race`). |
| **Async/Await** | Most async code — clearest syntax for sequential operations and `try/catch` error handling. |
| **Fetch API** | All HTTP requests from the browser. |
| **AbortController** | Cancelling in-flight requests (e.g., search-as-you-type, navigating away). |

---

## Further Reading

- [MDN – Asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)
- [MDN – Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [MDN – async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN – Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN – CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [javascript.info – Promises, async/await](https://javascript.info/async)
- [Jake Archibald – In The Loop (JSConf talk)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
