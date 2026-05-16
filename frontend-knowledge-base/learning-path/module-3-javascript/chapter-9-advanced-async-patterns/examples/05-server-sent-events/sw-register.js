/* ─────────────────────────────────────────────────────────────────────────
 *  sw-register.js
 *  Registers the Service Worker that intercepts /sse-stream.
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js', { scope: './' })
    .then(reg => {
      console.log('Service Worker registered:', reg.scope);
    })
    .catch(err => {
      console.warn('Service Worker registration failed:', err);
      document.querySelector('.info-box').innerHTML +=
        '<br><strong style="color:#f87171">⚠️  Service Worker not available. ' +
        'Serve this folder via a local HTTP server (e.g. <code>npx serve .</code>) ' +
        'to enable the simulated SSE endpoint.</strong>';
    });
}
