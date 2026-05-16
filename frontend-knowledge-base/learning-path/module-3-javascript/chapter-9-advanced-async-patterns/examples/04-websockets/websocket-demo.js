/* ─────────────────────────────────────────────────────────────────────────
 *  websocket-demo.js
 *  Interactive WebSocket demo — connects to wss://echo.websocket.org
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ── DOM Refs ──────────────────────────────────────────────────────────────

const connectBtn    = document.getElementById('btn-connect');
const disconnectBtn = document.getElementById('btn-disconnect');
const statusDot     = document.getElementById('status-dot');
const statusLabel   = document.getElementById('status-label');
const readyStateEl  = document.getElementById('ready-state');
const chatLog       = document.getElementById('chat-log');
const msgForm       = document.getElementById('msg-form');
const msgInput      = document.getElementById('msg-input');
const sendBtn       = document.getElementById('btn-send');

// ── State ─────────────────────────────────────────────────────────────────

let ws = null;
let retryTimeout = null;
let retryDelay = 1000;
const MAX_RETRY_DELAY = 16_000;
let userClosedIntentionally = false;

// ── Connection helpers ────────────────────────────────────────────────────

/** Update the status indicator in the UI */
function setStatus(label, state) {
  statusLabel.textContent = label;
  statusDot.className = `status-dot ${state}`;
  readyStateEl.textContent = `readyState: ${ws?.readyState ?? '—'}`;

  // Highlight the matching row in the state table
  document.querySelectorAll('.state-row[data-state]').forEach(row => {
    row.classList.toggle('active-state', row.dataset.state === String(ws?.readyState));
  });
}

/** Append a message bubble to the chat log */
function addMessage(text, type = 'received') {
  const placeholder = chatLog.querySelector('.chat-placeholder');
  if (placeholder) placeholder.remove();

  const bubble = document.createElement('div');
  bubble.className = `bubble bubble-${type}`;

  const time = new Date().toLocaleTimeString();
  bubble.innerHTML = `
    <span class="bubble-text">${escapeHtml(text)}</span>
    <span class="bubble-time">${time}</span>
  `;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

/** Append a system message (connect/disconnect notices) */
function addSystemMsg(text, cls = '') {
  const el = document.createElement('div');
  el.className = `system-msg ${cls}`;
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── WebSocket connection ───────────────────────────────────────────────────

function connect() {
  userClosedIntentionally = false;

  // Public WebSocket echo server — echoes back every message you send
  const WS_URL = 'wss://echo.websocket.org';

  setStatus('Connecting…', 'connecting');
  connectBtn.disabled = true;

  ws = new WebSocket(WS_URL);

  // ── open ──────────────────────────────────────────────────────────────
  ws.addEventListener('open', () => {
    retryDelay = 1000; // Reset back-off on successful connection
    setStatus('Connected', 'open');
    disconnectBtn.disabled = false;
    msgInput.disabled  = false;
    sendBtn.disabled   = false;
    msgInput.focus();

    addSystemMsg('🟢 Connected to echo.websocket.org', 'sys-ok');

    // Auto-send a greeting to demonstrate the echo
    const greeting = JSON.stringify({ type: 'greeting', text: 'Hello from the WebSocket demo!' });
    ws.send(greeting);
    addMessage(greeting, 'sent');
  });

  // ── message ───────────────────────────────────────────────────────────
  ws.addEventListener('message', event => {
    const raw = event.data;
    // Try to pretty-print JSON; otherwise show raw text
    let display = raw;
    try {
      const parsed = JSON.parse(raw);
      display = JSON.stringify(parsed, null, 2);
    } catch { /* not JSON — use raw */ }

    addMessage(display, 'received');
  });

  // ── close ─────────────────────────────────────────────────────────────
  ws.addEventListener('close', event => {
    setStatus('Disconnected', 'closed');
    disconnectBtn.disabled = true;
    msgInput.disabled  = true;
    sendBtn.disabled   = true;
    readyStateEl.textContent = `readyState: 3 (CLOSED)`;

    const reason = event.reason || '(no reason given)';
    addSystemMsg(`🔴 Disconnected — code ${event.code}, reason: "${reason}"`, 'sys-err');

    if (!userClosedIntentionally) {
      scheduleReconnect();
    } else {
      connectBtn.disabled = false;
    }
  });

  // ── error ─────────────────────────────────────────────────────────────
  ws.addEventListener('error', () => {
    addSystemMsg('⚠️  WebSocket error (connection will close)', 'sys-warn');
    setStatus('Error', 'error');
  });
}

/** Schedule auto-reconnect with exponential back-off */
function scheduleReconnect() {
  addSystemMsg(`↩ Reconnecting in ${retryDelay / 1000}s…`, 'sys-warn');
  retryTimeout = setTimeout(() => {
    connect();
    retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
  }, retryDelay);
}

function disconnect() {
  userClosedIntentionally = true;
  clearTimeout(retryTimeout);

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    // 1000 = Normal Closure
    ws.close(1000, 'User disconnected');
  }

  connectBtn.disabled = false;
}

// ── Event listeners ───────────────────────────────────────────────────────

connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);

msgForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  if (ws?.readyState === WebSocket.OPEN) {
    // Decide whether to send as JSON or plain text
    const isJSON = text.startsWith('{') || text.startsWith('[');
    let payload;
    try {
      payload = isJSON ? JSON.stringify(JSON.parse(text)) : text;
    } catch {
      payload = text; // Send as-is if invalid JSON
    }

    ws.send(payload);
    addMessage(payload, 'sent');
    msgInput.value = '';
  } else {
    addSystemMsg('⚠️  Not connected — please connect first', 'sys-warn');
  }
});

// Update readyState display every 500ms for educational value
setInterval(() => {
  if (ws) {
    const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
    const stateStr = states[ws.readyState] ?? '?';
    readyStateEl.textContent = `readyState: ${ws.readyState} (${stateStr})`;

    document.querySelectorAll('.state-row[data-state]').forEach(row => {
      row.classList.toggle('active-state', row.dataset.state === String(ws.readyState));
    });
  }
}, 500);
