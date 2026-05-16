/* ─────────────────────────────────────────────────────────────────────────
 *  service-worker.js
 *  Intercepts GET /sse-stream and returns a live text/event-stream response
 *  so that the EventSource API works without a real server.
 *
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

const STOCKS = [
  { symbol: 'AAPL', price: 189.0 },
  { symbol: 'GOOG', price: 175.5 },
  { symbol: 'MSFT', price: 415.0 },
  { symbol: 'AMZN', price: 185.2 },
  { symbol: 'TSLA', price: 174.5 },
];

let eventId = 0;

/** Generate a realistic-looking price fluctuation */
function fluctuate(price) {
  const change = (Math.random() - 0.5) * 4; // ±$2
  return Math.max(1, +(price + change).toFixed(2));
}

/** Build a single SSE event string */
function buildEvent(type, data, id) {
  return `id: ${id}\nevent: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname !== '/sse-stream') return; // Only intercept our endpoint

  let intervalId;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      // Send a "connected" event immediately
      const connectMsg = buildEvent('connected', { message: 'SSE stream started' }, ++eventId);
      controller.enqueue(new TextEncoder().encode(connectMsg));

      // Send stock updates every second
      intervalId = setInterval(() => {
        if (closed) {
          clearInterval(intervalId);
          controller.close();
          return;
        }

        // Pick a random stock to update
        const stock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
        stock.price = fluctuate(stock.price);

        const payload = {
          symbol: stock.symbol,
          price: stock.price,
          change: +(Math.random() * 4 - 2).toFixed(2),
          timestamp: new Date().toISOString(),
        };

        const msg = buildEvent('stock-update', payload, ++eventId);
        controller.enqueue(new TextEncoder().encode(msg));

        // Occasionally send a heartbeat comment (keeps connection alive)
        if (eventId % 5 === 0) {
          controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'));
        }
      }, 1000);
    },

    cancel() {
      closed = true;
      clearInterval(intervalId);
    }
  });

  event.respondWith(
    new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    })
  );
});

// Activate immediately — no waiting for old tabs to close
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
