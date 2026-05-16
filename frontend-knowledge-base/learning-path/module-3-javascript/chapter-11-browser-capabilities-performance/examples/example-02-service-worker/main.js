/**
 * main.js — Page-side Service Worker controller.
 *
 * Key concepts:
 *  - Registering a Service Worker
 *  - Checking registration state
 *  - Communicating with the SW via postMessage
 *  - Listening for SW lifecycle events
 */

const log          = document.getElementById('log');
const swStatus     = document.getElementById('sw-status');
const onlineStatus = document.getElementById('online-status');
const btnRegister  = document.getElementById('btn-register');
const btnUpdate    = document.getElementById('btn-update');
const btnUnreg     = document.getElementById('btn-unregister');
const btnListCache = document.getElementById('btn-list-cache');
const btnClearCache= document.getElementById('btn-clear-cache');
const btnFetch     = document.getElementById('btn-test-fetch');
const btnClearLog  = document.getElementById('btn-clear-log');

// ─── Logging helper ───────────────────────────────────────────────────────────
function addLog(message, type = 'info') {
  const line = document.createElement('div');
  line.className = `log-${type}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

// ─── Online/offline status ────────────────────────────────────────────────────
function updateOnlineStatus() {
  if (navigator.onLine) {
    onlineStatus.textContent = 'Online';
    onlineStatus.className   = 'badge green';
  } else {
    onlineStatus.textContent = 'Offline';
    onlineStatus.className   = 'badge red';
    addLog('Network connection lost — SW cache will serve requests', 'warn');
  }
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// ─── SW availability check ────────────────────────────────────────────────────
if (!('serviceWorker' in navigator)) {
  addLog('Service Workers are NOT supported in this browser', 'error');
  btnRegister.disabled = true;
} else {
  addLog('Service Worker API is available', 'success');
  checkExistingRegistration();
}

// ─── Check if SW is already registered ────────────────────────────────────────
async function checkExistingRegistration() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    addLog(`Existing SW found — scope: ${registration.scope}`, 'success');
    onRegistrationReady(registration);
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────
btnRegister.addEventListener('click', async () => {
  try {
    addLog('Registering Service Worker…', 'info');

    const registration = await navigator.serviceWorker.register('./sw.js', {
      scope: './',
    });

    addLog(`SW registered — scope: ${registration.scope}`, 'success');

    if (registration.installing) {
      addLog('SW is installing…', 'warn');
      trackState(registration.installing, 'installing');
    } else if (registration.waiting) {
      addLog('SW is waiting to activate…', 'warn');
    } else if (registration.active) {
      addLog('SW is already active', 'success');
    }

    onRegistrationReady(registration);
  } catch (err) {
    addLog(`Registration failed: ${err.message}`, 'error');
    console.error(err);
  }
});

function onRegistrationReady(registration) {
  swStatus.textContent = 'Registered';
  swStatus.className   = 'badge green';
  btnRegister.disabled = true;
  btnUpdate.disabled   = false;
  btnUnreg.disabled    = false;

  // Track state changes
  registration.addEventListener('updatefound', () => {
    addLog('New SW version found — installing…', 'warn');
    trackState(registration.installing, 'new version');
  });
}

function trackState(worker, label) {
  worker.addEventListener('statechange', () => {
    addLog(`SW (${label}) state → ${worker.state}`, 'info');
    if (worker.state === 'activated') {
      addLog('SW is now active and controlling the page!', 'success');
    }
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────
btnUpdate.addEventListener('click', async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;
  addLog('Checking for SW update…', 'info');
  await registration.update();
  addLog('Update check complete (no update = current version is latest)', 'info');
});

// ─── Unregister ───────────────────────────────────────────────────────────────
btnUnreg.addEventListener('click', async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;
  const success = await registration.unregister();
  if (success) {
    addLog('SW unregistered successfully', 'warn');
    swStatus.textContent = 'Unregistered';
    swStatus.className   = 'badge red';
    btnRegister.disabled = false;
    btnUpdate.disabled   = true;
    btnUnreg.disabled    = true;
  }
});

// ─── Messages from SW ─────────────────────────────────────────────────────────
navigator.serviceWorker.addEventListener('message', (event) => {
  const { type, version, urls } = event.data;

  if (type === 'SW_INSTALLED')  addLog(`SW installed (${version})`, 'success');
  if (type === 'SW_ACTIVATED')  addLog(`SW activated (${version}) — caching complete`, 'success');
  if (type === 'CACHE_CLEARED') addLog('Cache cleared by SW', 'warn');

  if (type === 'CACHE_KEYS') {
    if (urls.length === 0) {
      addLog('Cache is empty', 'warn');
    } else {
      addLog(`Cached URLs (${urls.length}):`, 'info');
      urls.forEach((url) => addLog(`  → ${url}`, 'info'));
    }
  }
});

// ─── Cache list ───────────────────────────────────────────────────────────────
btnListCache.addEventListener('click', async () => {
  const sw = navigator.serviceWorker.controller;
  if (!sw) {
    addLog('No active SW — register first', 'warn');
    return;
  }
  sw.postMessage({ type: 'GET_CACHE_KEYS' });
});

// ─── Clear cache ──────────────────────────────────────────────────────────────
btnClearCache.addEventListener('click', async () => {
  const sw = navigator.serviceWorker.controller;
  if (!sw) {
    // Clear directly from page if no SW controller
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    addLog('All caches cleared from page context', 'warn');
    return;
  }
  sw.postMessage({ type: 'CLEAR_CACHE' });
});

// ─── Test fetch (served by SW) ────────────────────────────────────────────────
btnFetch.addEventListener('click', async () => {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  addLog(`Fetching: ${url}`, 'info');
  try {
    const response = await fetch(url);
    const data     = await response.json();
    addLog(`Response: ${JSON.stringify(data)}`, 'success');
    addLog('(Turn off network in DevTools and retry — SW will serve cached response)', 'warn');
  } catch (err) {
    addLog(`Fetch error: ${err.message}`, 'error');
  }
});

// ─── Clear log ────────────────────────────────────────────────────────────────
btnClearLog.addEventListener('click', () => { log.innerHTML = ''; });
