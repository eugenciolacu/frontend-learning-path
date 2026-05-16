/**
 * main.js — Wires the UI to debounce/throttle utilities.
 */

// ─── 1. Debounce — Search Input ───────────────────────────────────────────────
let rawCount       = 0;
let debouncedCount = 0;

const rawCountEl       = document.getElementById('raw-count');
const debouncedCountEl = document.getElementById('debounced-count');
const timeline         = document.getElementById('debounce-timeline');

function appendTimeline(text, color = '#94a3b8') {
  if (timeline.children.length === 1 && timeline.firstChild.textContent.startsWith('Events')) {
    timeline.innerHTML = '';
  }
  const span = document.createElement('span');
  span.style.color = color;
  span.textContent = text;
  timeline.appendChild(document.createTextNode(' '));
  timeline.appendChild(span);
  timeline.scrollLeft = timeline.scrollWidth;
}

const searchInput = document.getElementById('search-input');

// Raw handler — fires on every input event
searchInput.addEventListener('input', () => {
  rawCount++;
  rawCountEl.textContent = rawCount;
  appendTimeline('⬤', '#fca5a5'); // red dot = raw event
});

// Debounced handler — fires 300ms after user stops typing
const handleSearchDebounced = debounce((event) => {
  debouncedCount++;
  debouncedCountEl.textContent = debouncedCount;
  appendTimeline(`✓(${event.target.value.slice(-6) || '…'})`, '#86efac'); // green = debounced call
}, 300);

searchInput.addEventListener('input', handleSearchDebounced);

// ─── 2. Throttle — Scroll area ────────────────────────────────────────────────
const scrollArea      = document.getElementById('scroll-area');
const scrollRawEl     = document.getElementById('scroll-raw');
const scrollThrottled = document.getElementById('scroll-throttled');
const scrollRafEl     = document.getElementById('scroll-raf');

let scrollRawCount  = 0;
let scrollThrCount  = 0;
let scrollRafCount  = 0;

// Raw scroll — fires on every pixel
scrollArea.addEventListener(
  'scroll',
  () => {
    scrollRawCount++;
    scrollRawEl.textContent = scrollRawCount;
  },
  { passive: true }   // ← passive: browser scrolls without waiting
);

// Throttled scroll — at most once per 200ms
const handleScrollThrottled = throttle(() => {
  scrollThrCount++;
  scrollThrottled.textContent = scrollThrCount;
}, 200);

scrollArea.addEventListener('scroll', handleScrollThrottled, { passive: true });

// RAF-throttled scroll — synced to screen refresh
const handleScrollRaf = rafThrottle(() => {
  scrollRafCount++;
  scrollRafEl.textContent = scrollRafCount;
});

scrollArea.addEventListener('scroll', handleScrollRaf, { passive: true });

// ─── 3. Leading-edge debounce — bonus demo (console) ─────────────────────────
const ledgingBtn = debounceLeading(() => {
  console.log('[debounceLeading] Executed at', Date.now());
}, 1000);

// You can call ledgingBtn() rapidly in the console to observe leading-edge behavior
window._demoLeadingDebounce = ledgingBtn;
console.log(
  'Tip: Call window._demoLeadingDebounce() multiple times quickly in the console to see leading-edge debounce.'
);
