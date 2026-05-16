/* ─────────────────────────────────────────────────────────────────────────
 *  sse-demo.js
 *  EventSource client demo — connects to /sse-stream intercepted by SW.
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ── DOM refs ──────────────────────────────────────────────────────────────

const startBtn    = document.getElementById('btn-start');
const stopBtn     = document.getElementById('btn-stop');
const clearBtn    = document.getElementById('btn-clear-feed');
const connDot     = document.getElementById('conn-dot');
const connLabel   = document.getElementById('conn-label');
const lastIdEl    = document.getElementById('last-id');
const tickerGrid  = document.getElementById('ticker-grid');
const rawFeed     = document.getElementById('raw-feed');

// ── State ─────────────────────────────────────────────────────────────────

let eventSource = null;
const stockCards = {}; // symbol → DOM element

// ── Helpers ───────────────────────────────────────────────────────────────

function setConnection(state) {
  const labels = { connecting: 'Connecting…', open: 'Connected', closed: 'Disconnected' };
  connDot.className  = `dot dot-${state}`;
  connLabel.textContent = labels[state] ?? state;
}

function appendRaw(text, cls = '') {
  const line = document.createElement('div');
  line.textContent = text;
  line.className = cls;
  rawFeed.appendChild(line);
  rawFeed.scrollTop = rawFeed.scrollHeight;
}

/** Create or update a stock card in the ticker grid */
function updateTicker(data) {
  const { symbol, price, change } = data;
  const direction = change >= 0 ? 'up' : 'down';
  const arrow     = change >= 0 ? '▲' : '▼';
  const sign      = change >= 0 ? '+' : '';

  if (!stockCards[symbol]) {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.id = `stock-${symbol}`;
    tickerGrid.appendChild(card);
    stockCards[symbol] = card;
  }

  const card = stockCards[symbol];
  card.className = `stock-card flash-${direction}`;
  card.innerHTML = `
    <div class="stock-symbol">${symbol}</div>
    <div class="stock-price">$${price.toFixed(2)}</div>
    <div class="stock-change ${direction}">${arrow} ${sign}${change.toFixed(2)}</div>
  `;

  // Remove flash class after animation
  setTimeout(() => card.classList.remove(`flash-${direction}`), 600);
}

// ── EventSource lifecycle ─────────────────────────────────────────────────

function startSSE() {
  if (eventSource) return;

  setConnection('connecting');
  startBtn.disabled = true;
  stopBtn.disabled  = false;

  // Connect to the intercepted endpoint
  eventSource = new EventSource('/sse-stream');

  // ── open ──────────────────────────────────────────────────────────────
  eventSource.addEventListener('open', () => {
    setConnection('open');
    appendRaw('✅ Connection opened', 'log-ok');
    appendRaw(`readyState: ${eventSource.readyState} (OPEN)`, 'log-info');
  });

  // ── named event: connected ────────────────────────────────────────────
  eventSource.addEventListener('connected', event => {
    const data = JSON.parse(event.data);
    appendRaw(`[connected] ${data.message}`, 'log-info');
    lastIdEl.textContent = `Last-Event-ID: ${event.lastEventId}`;
  });

  // ── named event: stock-update ─────────────────────────────────────────
  eventSource.addEventListener('stock-update', event => {
    const data = JSON.parse(event.data);
    updateTicker(data);
    lastIdEl.textContent = `Last-Event-ID: ${event.lastEventId}`;
    appendRaw(
      `[stock-update #${event.lastEventId}] ${data.symbol} $${data.price.toFixed(2)}  (${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)})`,
      data.change >= 0 ? 'log-ok' : 'log-err'
    );
  });

  // ── default 'message' event ───────────────────────────────────────────
  // Fires for events without an explicit 'event:' field in the SSE stream
  eventSource.addEventListener('message', event => {
    appendRaw(`[message] ${event.data}`, 'log-info');
  });

  // ── error ─────────────────────────────────────────────────────────────
  eventSource.addEventListener('error', () => {
    const state = eventSource?.readyState;
    if (state === EventSource.CONNECTING) {
      appendRaw('⚠️  Connection lost — EventSource will retry automatically', 'log-warn');
      setConnection('connecting');
    } else if (state === EventSource.CLOSED) {
      appendRaw('🔴 EventSource closed (server ended stream)', 'log-err');
      setConnection('closed');
      resetButtons();
    }
  });
}

function stopSSE() {
  if (!eventSource) return;
  eventSource.close(); // Permanently stops — no auto-reconnect
  eventSource = null;
  setConnection('closed');
  appendRaw('🔴 Unsubscribed — connection closed by client', 'log-warn');
  resetButtons();
}

function resetButtons() {
  startBtn.disabled = false;
  stopBtn.disabled  = true;
  eventSource = null;
}

// ── Button listeners ──────────────────────────────────────────────────────

startBtn.addEventListener('click', startSSE);
stopBtn.addEventListener('click', stopSSE);
clearBtn.addEventListener('click', () => {
  rawFeed.innerHTML = '';
  tickerGrid.innerHTML = '';
  Object.keys(stockCards).forEach(k => delete stockCards[k]);
});
